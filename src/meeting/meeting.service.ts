import { HttpService } from '@nestjs/axios';
import { Injectable, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { MeetingToCreate, mailToCheck } from 'src/utils/constants';
import {
  checkEmailRegistration,
  createMeetingWithData,
  enrollEmailToMeeting,
  getProfile,
  getToken,
  registerEmailToZoom,
} from 'src/utils/helper';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';

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
        const access_token = await getToken(code);
        await getProfile(access_token);
        const meetingDetails = await createMeetingWithData(
          access_token,
          MeetingToCreate,
        );
        const isEmailAlreadyRegister = await checkEmailRegistration(
          access_token,
          mailToCheck,
        );

        if (!isEmailAlreadyRegister) {
          await registerEmailToZoom(access_token, mailToCheck);
        }
        const enrollEmailResp = await enrollEmailToMeeting(
          access_token,
          mailToCheck,
          meetingDetails.id,
        );

        return res.send(enrollEmailResp.join_url).status(200);
      } else {
        return res.redirect(this.ZOOM_AUTH_URL);
      }
    } catch (error) {
      console.log(
        'error.response.data || error',
        error?.response?.data || error,
      );
      return res.json(error?.response?.data || error).status(400);
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
