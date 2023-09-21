import axios from 'axios';
import {
  ICheckMailResp,
  ICreateMeetingPayload,
  ICreateMeetingResp,
  IEnrollEmailToMeetingResp,
  IGetTokenResp,
  IMyProfileResp,
  IRegisterEmailToZoomResp,
} from 'src/meeting/common';

// get access token and refresh token from api
export const getToken = async (code: string): Promise<string> => {
  try {
    const { data: getTokenData } = await axios.request<IGetTokenResp>({
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
    });
    const access_token = getTokenData.access_token;
    console.log('getTokenData', getTokenData);
    return access_token;
  } catch (error) {
    throw {
      method: 'Get Token Failed',
      error: error?.response?.data || error,
    };
  }
};

// get profile of user from token
export const getProfile = async (
  access_token: string,
): Promise<IMyProfileResp> => {
  try {
    const { data: myProfileResp } = await axios.request<IMyProfileResp>({
      url: `${process.env.ZOOM_US_BASE_URL}users/me`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    console.log('myProfileResp', myProfileResp);
    return myProfileResp;
  } catch (error) {
    throw {
      method: 'Get Profile Failed',
      error: error?.response?.data || error,
    };
  }
};

// create a meeting via access token
export const createMeetingWithData = async (
  access_token: string,
  data: ICreateMeetingPayload,
): Promise<ICreateMeetingResp> => {
  try {
    const { data: createMeetingResponse } =
      await axios.request<ICreateMeetingResp>({
        url: `${process.env.ZOOM_US_BASE_URL}users/me/meetings`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        data,
      });
    console.log('createMeetingResponse', createMeetingResponse);
    return createMeetingResponse;
  } catch (error) {
    throw {
      method: 'Create Meeting Failed',
      error: error?.response?.data || error,
    };
  }
};

// check if a email already registered with zoom
export const checkEmailRegistration = async (
  access_token: string,
  mailToCheck: string,
): Promise<boolean> => {
  try {
    const { data: checkIsEmailRegisteredResp } =
      await axios.request<ICheckMailResp>({
        url: `${process.env.ZOOM_US_BASE_URL}users/email?email=${mailToCheck}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
    console.log('checkIsEmailRegisteredResp', checkIsEmailRegisteredResp);
    return checkIsEmailRegisteredResp.existed_email;
  } catch (error) {
    throw {
      method: 'Check Email Failed',
      error: error?.response?.data || error,
    };
  }
};
// register email to zoom
export const registerEmailToZoom = async (
  access_token: string,
  mailToRegister: string,
): Promise<IRegisterEmailToZoomResp> => {
  try {
    const { data: registerUserResponse } =
      await axios.request<IRegisterEmailToZoomResp>({
        url: `${process.env.ZOOM_US_BASE_URL}users`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        data: {
          action: 'create',
          user_info: {
            email: mailToRegister,
            first_name: mailToRegister.slice(
              0,
              mailToRegister.indexOf('@') + 1,
            ),
            type: 1,
            feature: {
              zoom_phone: false,
              zoom_one_type: 16,
            },
            plan_united_type: '1',
          },
        },
      });
    console.log('registerUserResponse', registerUserResponse);
    return registerUserResponse;
  } catch (error) {
    throw {
      method: 'Check Email Failed',
      error: error?.response?.data || error,
    };
  }
};

// register email to zoom
export const enrollEmailToMeeting = async (
  access_token: string,
  mailToRegister: string,
  meetingId: number,
): Promise<IEnrollEmailToMeetingResp> => {
  try {
    const { data: enrollEmailResp } =
      await axios.request<IEnrollEmailToMeetingResp>({
        url: `${process.env.ZOOM_US_BASE_URL}meetings/${meetingId}/registrants`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        data: {
          first_name: mailToRegister.slice(0, mailToRegister.indexOf('@') + 1),
          email: mailToRegister,
          language: 'en-US',
          auto_approve: true,
        },
      });
    console.log('enrollEmailResp', enrollEmailResp);
    return enrollEmailResp;
  } catch (error) {
    throw {
      method: 'Check Email Failed',
      error: error?.response?.data || error,
    };
  }
};
