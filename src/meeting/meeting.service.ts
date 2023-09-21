import { Injectable, Req, Res } from '@nestjs/common';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { HttpService } from '@nestjs/axios';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MeetingService {
  constructor(private readonly httpService: HttpService) {}

  ZOOM_AUTH_URL = encodeURI(
    `https://zoom.us/oauth/authorize?response_type=code&client_id=${process.env.ZOOM_US_CLIENT_ID}&redirect_uri=${process.env.ZOOM_US_REDIRECT_URI}`,
  );
  create(createMeetingDto: CreateMeetingDto) {
    return `This action adds a new meeting with ${createMeetingDto}`;
  }

  async findAll(@Req() req: Request, @Res() res: Response) {
    try {
      if (req.query['code']) {
        const code = req.query['code'] as string;
        // get access token and refresh token from api
        const { data: getTokenData } = await firstValueFrom<{
          data: {
            access_token: string;
            token_type: string;
            refresh_token: string;
            expires_in: number;
            scope: string;
          };
        }>(
          this.httpService.request({
            url: 'https://zoom.us/oauth/token',
            method: 'POST',
            data: {
              code: code,
              grant_type: 'authorization_code',
              redirect_uri: process.env.ZOOM_US_REDIRECT_URI,
            },
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: `Basic ${Buffer.from(
                process.env.ZOOM_US_CLIENT_ID +
                  ':' +
                  process.env.ZOOM_US_CLIENT_SECRET,
              ).toString('base64')}`,
            },
          }),
        );
        const access_token = getTokenData.access_token;
        // verify access token
        // const { data: verifyAccessTokenData } = await firstValueFrom<{
        //   data: {
        //     id: string;
        //     first_name: string;
        //     last_name: string;
        //     display_name: string;
        //     email: string;
        //     type: number;
        //     role_name: string;
        //     pmi: number;
        //     use_pmi: boolean;
        //     personal_meeting_url: string;
        //     timezone: string;
        //     verified: number;
        //     dept: string;
        //     created_at: string;
        //     last_login_time: string;
        //     last_client_version: string;
        //     pic_url: string;
        //     cms_user_id: string;
        //     jid: string;
        //     group_ids: number[];
        //     im_group_ids: number[];
        //     account_id: string;
        //     language: string;
        //     phone_country: string;
        //     phone_number: string;
        //     status: string;
        //     job_title: string;
        //     location: string;
        //     login_types: number[];
        //     role_id: string;
        //     account_number: number;
        //     cluster: string;
        //     user_created_at: string;
        //   };
        // }>(
        //   this.httpService.request({
        //     url: 'https://api.zoom.us/v2/users/me',
        //     method: 'GET',
        //     headers: {
        //       Authorization: `Bearer ${access_token}`,
        //     },
        //   }),
        // );
        console.log('getTokenData', getTokenData);
        // console.log({ verifyAccessTokenData });

        // create a meeting via access token
        const { data: createMeetingResponse } = await firstValueFrom<{
          data: {
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
          };
        }>(
          this.httpService.request({
            url: `https://api.zoom.us/v2/users/me/meetings`,
            method: 'POST',
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
            data: {
              topic: 'Meeting created via api',
              type: 2,
              start_time: new Date().setMonth(8),
              duration: '45',
              timezone: 'Asia/Calcutta',
              agenda: 'test',

              recurrence: { type: 1, repeat_interval: 1 },
              settings: {
                host_video: 'true',
                participant_video: 'true',
                join_before_host: 'False',
                mute_upon_entry: 'False',
                watermark: 'true',
                audio: 'voip',
                auto_recording: 'cloud',
              },
            },
          }),
        );
        console.log('createMeetingResponse', createMeetingResponse);
        const mailToCheck = 'ajay.ranga@hcode.tech';
        const { data: checkIsEmailRegisteredResp } = await firstValueFrom<{
          data: { existed_email: boolean };
        }>(
          this.httpService.request({
            url: `https://api.zoom.us/v2/users/email?email=${mailToCheck}`,
            method: 'GET',
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }),
        );
        console.log(
          'checkIsEmailRegisteredResp',
          checkIsEmailRegisteredResp.existed_email,
        );
        // registering a user to zoom
        if (!checkIsEmailRegisteredResp.existed_email) {
          const { data: registerUserResponse } = await firstValueFrom<{
            data: any;
          }>(
            this.httpService.request({
              url: `https://api.zoom.us/v2/users`,
              method: 'POST',
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
              data: {
                action: 'create',
                user_info: {
                  email: mailToCheck,
                  first_name: mailToCheck.slice(
                    0,
                    mailToCheck.indexOf('@') + 1,
                  ),
                  last_name: 'Chill',
                  display_name: 'Jill Chill',
                  type: 1,
                  feature: {
                    zoom_phone: false,
                    zoom_one_type: 16,
                  },
                  plan_united_type: '1',
                },
              },
            }),
          );
          console.log('registerUserResponse', registerUserResponse);
        }

        const { data: addMeetingRegistrant } = await firstValueFrom<{
          data: any;
        }>(
          this.httpService.request({
            url: `https://api.zoom.us/v2/meetings/${createMeetingResponse.id}/registrants`,
            method: 'POST',
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
            data: {
              first_name: mailToCheck.slice(0, mailToCheck.indexOf('@') + 1),
              email: mailToCheck,
              language: 'en-US',
              auto_approve: true,
            },
          }),
        );
        console.log('addMeetingRegistrant', addMeetingRegistrant);

        return res.send(checkIsEmailRegisteredResp).status(200);
      } else {
        return res.redirect(this.ZOOM_AUTH_URL);
      }
    } catch (error) {
      console.log('error.response.data || error', error.response.data || error);
      return res.json(error.response.data || error).status(400);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} meeting`;
  }

  update(id: number, updateMeetingDto: UpdateMeetingDto) {
    return `This action updates a #${id} meeting ${updateMeetingDto}`;
  }

  remove(id: number) {
    return `This action removes a #${id} meeting`;
  }
}
