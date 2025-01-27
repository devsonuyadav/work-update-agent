import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';

export async function POST(request: Request) {
  const { to, subject, text, userEmail } = await request.json();

  const CLIENT_ID =
    '872463993134-lonf348ig2qe8cv0dk29taad6oo72nlm.apps.googleusercontent.com';
  const CLIENT_SECRET = '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';
  const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

  const REFRESH_TOKEN =
    "AMf-vBwlHYtp4whtCUW2aD0DkxMbJreZPvaVBSlWfJRSEKC-neaT2hZzwz1CUUgXkrCtdze1vr0vzlUAr0S-pJGj5E0O4oJWR5-Xyn7TX9M3KwUTShGkDGYxJVEMz8Ohda8ExFFD6r5OmkOgMzetJJ3_MMg6i9yU2a4F6jxRQNSkUl3z5i_iNHNWNMrV67zQfNL4dTntGsqfNdrcu0mHuu7EWw4mZ6KDiTgleScxMqt0sNRpH0E3zQrU57oeI5Kmyzi0oQT7YAmUXiI1E7MWn14nD8zRn4KACdpZVm3Ed5xfkG-MvmABiX-ydFzzqvC41LffhZEs6ySVtkOjwzZYCEOlpXP6ZwjcLf_97DTWuhv40mckh7hIgLpSRKqs55mJe7TPU9MnTgHcACZidG4xY-YDXhom4uD5uXskcmzzfI4k5-jFDawDeh0"

    const oAuth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI
  );
   oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

  const accessToken = await oAuth2Client.getAccessToken();
  console.log({accessToken})


  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth : {
        type: 'OAuth2',
        user: 'sky32752@gmail.com',
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    refreshToken: REFRESH_TOKEN,
    accessToken: accessToken.token || ''
      },
    });
    
   await transporter.sendMail({
      from: "sky32752@gmail.com",
      to: 'sky32752@gmail.com',
      subject: 'Test',
      text: 'Test',
      replyTo: userEmail
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
