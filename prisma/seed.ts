import bcrypt from 'bcrypt';
import {
  fallbackLocations,
  fallbackTasks,
} from '../src/app/modules/shohoj/shohoj.data';
import { UserRole } from '../src/generated/prisma/enums';
import { prisma } from '../src/lib/prisma';

async function seedSuperAdmin() {
  const requiredEnvVars = [
    'SUPERADMINEMAIL',
    'SUPERADMINPHONE',
    'SUPERADMINPASSWORD',
  ];
  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }

  const { SUPERADMINEMAIL, SUPERADMINPHONE, SUPERADMINPASSWORD } = process.env;

  const existingAdmin = await prisma.user.findUnique({
    where: { email: SUPERADMINEMAIL as string },
    select: { id: true },
  });

  if (existingAdmin) {
    console.log('Super admin already exists, skipping creation');
    return;
  }

  const hashPassword = await bcrypt.hash(SUPERADMINPASSWORD as string, 10);

  const superAdmin = await prisma.user.create({
    data: {
      email: SUPERADMINEMAIL as string,
      phone: SUPERADMINPHONE as string,
      password: hashPassword,
      role: UserRole.SUPER_ADMIN,
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  console.log('Super admin created successfully:', superAdmin);
}

async function seedShohojPathData() {
  const seedSlugs = fallbackTasks.map((task) => task.slug);
  const seedLocationNames = fallbackLocations.map((location) => location.name);

  const existingTasks = await prisma.task.findMany({
    where: {
      slug: {
        in: seedSlugs,
      },
    },
    select: {
      id: true,
    },
  });
  const existingTaskIds = existingTasks.map((task) => task.id);

  if (existingTaskIds.length > 0) {
    await prisma.comment.deleteMany({
      where: {
        taskId: {
          in: existingTaskIds,
        },
      },
    });

    const existingSteps = await prisma.step.findMany({
      where: {
        taskId: {
          in: existingTaskIds,
        },
      },
      select: {
        id: true,
      },
    });
    const existingStepIds = existingSteps.map((step) => step.id);

    if (existingStepIds.length > 0) {
      await prisma.vote.deleteMany({
        where: {
          stepId: {
            in: existingStepIds,
          },
        },
      });
      await prisma.step.deleteMany({
        where: {
          id: {
            in: existingStepIds,
          },
        },
      });
    }

    await prisma.task.deleteMany({
      where: {
        id: {
          in: existingTaskIds,
        },
      },
    });
  }

  await prisma.location.deleteMany({
    where: {
      name: {
        in: seedLocationNames,
      },
    },
  });

  const locationIdBySeedId = new Map<string, string>();

  for (const location of fallbackLocations) {
    const createdLocation = await prisma.location.create({
      data: {
        name: location.name,
        address: location.address,
        city: location.city,
        country: location.country,
        latitude: location.latitude,
        longitude: location.longitude,
        type: location.type,
        officeHours: location.officeHours,
      },
      select: {
        id: true,
      },
    });

    locationIdBySeedId.set(location.seedId, createdLocation.id);
  }

  for (const task of fallbackTasks) {
    await prisma.task.create({
      data: {
        slug: task.slug,
        title: task.title,
        tagline: task.tagline,
        description: task.description,
        summary: task.summary,
        category: task.category,
        estimatedDays: task.estimatedDays,
        estimatedCostBdt: task.estimatedCostBdt,
        difficulty: task.difficulty,
        documents: task.documents,
        aiSummary: task.aiSummary,
        communityTip: task.communityTip,
        coverLabel: task.coverLabel,
        reviewCount: task.reviewCount,
        savedCount: task.savedCount,
        popularityScore: task.popularityScore,
        isPublished: task.isPublished,
        steps: {
          create: task.steps.map((step) => ({
            title: step.title,
            description: step.description,
            order: step.order,
            estimatedTime: step.estimatedTime,
            estimatedCost: step.estimatedCost,
            documents: step.documents,
            tips: step.tips,
            contributionLocked: step.contributionLocked,
            ...(step.locationSeedId
              ? { locationId: locationIdBySeedId.get(step.locationSeedId) }
              : {}),
          })),
        },
      },
    });
  }

  console.log(
    `Seeded ${fallbackTasks.length} tasks and ${fallbackLocations.length} places`
  );
}

async function seed() {
  try {
    console.log('Starting database seeding...');
    await seedSuperAdmin();
    await seedShohojPathData();
    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
    console.log('Database connection closed');
  }
}

seed().catch((error) => {
  console.error('Fatal error during seeding:', error);
  process.exit(1);
});
