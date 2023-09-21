import { ICreateMeetingPayload } from 'src/meeting/common';

export const MeetingToCreate: ICreateMeetingPayload = {
  topic: 'Meeting created via api',
  type: 2,
  start_time: new Date(),
  duration: '45',
  timezone: 'Asia/Calcutta',
  agenda: 'test',

  recurrence: { type: 1, repeat_interval: 1 },
  settings: {
    host_video: true,
    participant_video: true,
    join_before_host: false,
    mute_upon_entry: false,
    watermark: true,
    audio: 'voip',
    auto_recording: 'cloud',
  },
};

export const mailToCheck = 'ajay.ranga@hcode.tech';
