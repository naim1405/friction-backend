export const getResetPasswordEmailHtml = (
	resetLink: string,
	validMinutes = 5
): string => {
	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>Reset Password</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Segoe UI,Tahoma,Arial,sans-serif;color:#0f172a;">
	<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:24px 12px;">
		<tr>
			<td align="center">
				<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;">
					<tr>
						<td style="padding:24px 28px;background:linear-gradient(135deg,#0f172a,#1e293b);color:#f8fafc;">
							<h1 style="margin:0;font-size:22px;line-height:1.3;">Reset Your Password</h1>
							<p style="margin:8px 0 0;font-size:14px;line-height:1.6;color:#cbd5e1;">A secure reset was requested for your account.</p>
						</td>
					</tr>
					<tr>
						<td style="padding:24px 28px;">
							<p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:#334155;">
								Click the button below to create a new password. This link will expire in ${validMinutes} minutes.
							</p>
							<p style="margin:18px 0 22px;">
								<a href="${resetLink}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:#0ea5e9;color:#ffffff;text-decoration:none;padding:11px 18px;border-radius:10px;font-weight:600;font-size:14px;">
									Reset Password
								</a>
							</p>
							<p style="margin:0;font-size:13px;line-height:1.7;color:#64748b;">
								If the button does not work, copy and paste this URL into your browser:
							</p>
							<p style="margin:8px 0 0;word-break:break-all;font-size:13px;color:#0f766e;">
								${resetLink}
							</p>
						</td>
					</tr>
					<tr>
						<td style="padding:18px 28px;border-top:1px solid #e2e8f0;background:#f8fafc;">
							<p style="margin:0;font-size:12px;line-height:1.6;color:#64748b;">
								If you did not request a password reset, you can safely ignore this email.
							</p>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
</body>
</html>`;
};
