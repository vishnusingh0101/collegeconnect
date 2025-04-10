// utils/googleCalendar.js
const { google } = require('googleapis');
const moment = require('moment');
const path = require('path');

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../google-credentials.json'),
  scopes: ['https://www.googleapis.com/auth/calendar'],
});

const createGoogleMeet = async ({ startTime, endTime, user, participant }) => {
  const calendar = google.calendar({ version: 'v3', auth: await auth.getClient() });

  const event = {
    summary: 'Scheduled Call',
    description: `Call between ${user.name} and ${participant.name}`,
    start: {
      dateTime: moment(startTime).toISOString(),
      timeZone: 'Asia/Kolkata',
    },
    end: {
      dateTime: moment(endTime).toISOString(),
      timeZone: 'Asia/Kolkata',
    },
    attendees: [
      { email: user.email },
      { email: participant.email }
    ],
    conferenceData: {
      createRequest: {
        requestId: `meet-${Date.now()}`,
        conferenceSolutionKey: {
          type: 'hangoutsMeet',
        },
      },
    },
  };

  const response = await calendar.events.insert({
    calendarId: 'primary',
    resource: event,
    conferenceDataVersion: 1,
  });

  return response.data.hangoutLink;
};

module.exports = { createGoogleMeet };