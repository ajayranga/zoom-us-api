export interface IGetTokenResp {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
}

export interface IMyProfileResp {
  id: string;
  first_name: string;
  last_name: string;
  display_name: string;
  email: string;
  type: number;
  role_name: string;
  pmi: number;
  use_pmi: boolean;
  personal_meeting_url: string;
  timezone: string;
  verified: number;
  dept: string;
  created_at: string;
  last_login_time: string;
  last_client_version: string;
  pic_url: string;
  cms_user_id: string;
  jid: string;
  group_ids: number[];
  im_group_ids: number[];
  account_id: string;
  language: string;
  phone_country: string;
  phone_number: string;
  status: string;
  job_title: string;
  location: string;
  login_types: number[];
  role_id: string;
  account_number: number;
  cluster: string;
  user_created_at: string;
}

export interface ICreateMeetingPayload {
  topic: string;
  type: number;
  start_time: Date;
  duration: string;
  timezone: string;
  agenda: string;
  recurrence: { type: number; repeat_interval: number };
  settings: {
    host_video: boolean;
    participant_video: boolean;
    join_before_host: boolean;
    mute_upon_entry: boolean;
    watermark: boolean;
    audio: string;
    auto_recording: string;
  };
}
export interface ICreateMeetingResp {
  uuid: string;
  id: number;
  host_id: string;
  host_email: string;
  topic: string;
  type: number;
  status: string;
  start_time: string;
  duration: number;
  timezone: string;
  agenda: string;
  created_at: string;
  start_url: string;
  join_url: string;
  password: string;
  h323_password: string;
  pstn_password: string;
  encrypted_password: string;
  settings: {
    host_video: boolean;
    participant_video: boolean;
    cn_meeting: boolean;
    in_meeting: boolean;
    join_before_host: boolean;
    jbh_time: number;
    mute_upon_entry: boolean;
    watermark: boolean;
    use_pmi: boolean;
    approval_type: number;
    audio: string;
    auto_recording: string;
    enforce_login: boolean;
    enforce_login_domains: string;
    alternative_hosts: string;
    alternative_host_update_polls: boolean;
    close_registration: boolean;
    show_share_button: boolean;
    allow_multiple_devices: boolean;
    registrants_confirmation_email: boolean;
    waiting_room: boolean;
    request_permission_to_unmute_participants: boolean;
    registrants_email_notification: boolean;
    meeting_authentication: boolean;
    encryption_type: string;
    approved_or_denied_countries_or_regions: { enable: boolean };
    breakout_room: { enable: boolean };
    internal_meeting: boolean;
    continuous_meeting_chat: {
      enable: boolean;
      auto_add_invited_external_users: boolean;
    };
    participant_focused_meeting: boolean;
    push_change_to_calendar: boolean;
    alternative_hosts_email_notification: boolean;
    show_join_info: boolean;
    device_testing: boolean;
    focus_mode: boolean;
    enable_dedicated_group_chat: boolean;
    private_meeting: boolean;
    email_notification: boolean;
    host_save_video_order: boolean;
    sign_language_interpretation: { enable: boolean };
    email_in_attendee_report: boolean;
  };
  pre_schedule: boolean;
}

export interface ICheckMailResp {
  existed_email: boolean;
}

export interface IRegisterEmailToZoomResp {
  email: string;
  first_name: string;
  id: string;
  last_name: string;
  type: number;
}

export interface IEnrollEmailToMeetingResp {
  id: number;
  join_url: string;
  registrant_id: string;
  start_time: string;
  topic: string;
  occurrences: [
    {
      duration: number;
      occurrence_id: string;
      start_time: string;
      status: string;
    },
  ];
  participant_pin_code: number;
}
