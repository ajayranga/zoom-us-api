import { Injectable } from '@nestjs/common';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';

@Injectable()
export class MeetingService {
  create(createMeetingDto: CreateMeetingDto) {
    console.log('createMeetingDto', createMeetingDto);
    return `This action adds a new meeting with ${createMeetingDto}`;
  }

  findAll() {
    return `This action returns all meeting`;
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
