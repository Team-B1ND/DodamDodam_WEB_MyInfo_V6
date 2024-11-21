import { ChangeEvent, useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import * as S from './style';
import { BiPlus } from 'react-icons/bi';
import DODAM_DEFAULT_PROFILE from '../../../../../images/default_profile.png';
import CAMERA_IMAGE from '../../../../../images/camera.svg';
import { MyInfoModifyModalState } from '../../../../../store/modal';
import useModifyMainProfile from '../../../../../hooks/mainProfile/useModifyMainProfile';
import fileUpload from '../../../../../repository/mainProfile/fileUpload';
import { autoHypenPhone } from '../../../../../util/autoHypenPhone';
import { profileInfo } from '../../../../../store/profile';
import useMyGradeInfo from '../../../../../hooks/profile/useMyGradeInfo';
import MyInfoClassModifyModal from '../MyInfoClassModifyModal/MyInfoClassModifyModal';
import patternCheck from '../../../../../util/patternCheck';
import { B1ndToast } from '@b1nd/b1nd-toastify';

const MyInfoModifyModal = () => {
  const setIsOpenMyInfoModifyModal = useSetRecoilState(MyInfoModifyModalState);

  const { isLoading } = useMyGradeInfo();
  const [tempProfileInfo, setTempProfileInfo] = useRecoilState(profileInfo);

  const { student, phone, email, profileImage } = tempProfileInfo;

  const [emailInfo, setEmailInfo] = useState<string>('');
  const [phoneInfo, setPhoneInfo] = useState<string>('');

  const [tempPhoneInfo, setTempPhoneInfo] = useState<string>('');

  const { patchMainProfile } = useModifyMainProfile();

  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const [emailIsModifying, setEmailIsModifying] = useState<boolean>(false);
  const [phoneIsModifying, setPhoneIsModifying] = useState<boolean>(false);
  const [classIsModifying, setClassIsModifying] = useState<boolean>(false);

  useEffect(() => {
    setEmailInfo(email);
    setTempPhoneInfo(`${phone.substring(0, 3)}-${phone.substring(3, 7)}-${phone.substring(7, 11)}`);
  }, [email, phone]);

  useEffect(() => {
    setImageSrc(profileImage);
  }, [profileImage]);

  const uploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const formData = new FormData();
      if (e.target.files) {
        const url = URL.createObjectURL(e.target.files[0]);
        setImageSrc(url);
        formData.append('file', e.target.files[0]);
        const { data } = await fileUpload.postFileUpload(formData.get('file') ? formData : '');
        if (data) {
          setImageSrc(data);
        }
      }
    } catch (error) {}
  };

  useEffect(() => {
    setPhoneInfo(tempPhoneInfo.split('-')[0] + tempPhoneInfo.split('-')[1] + tempPhoneInfo.split('-')[2]);
  }, [tempPhoneInfo]);

  const emailInfoHandler = (e: any) => {
    setEmailInfo(e.target.value);
  };

  const phoneInfoHandler = (e: any) => {
    setTempPhoneInfo(autoHypenPhone(e.target.value));
  };

  const updateInfo = async () => {
    if (
      !(
        emailInfo === tempProfileInfo?.email &&
        imageSrc === tempProfileInfo?.profileImage &&
        phoneInfo === tempProfileInfo.phone
      )
    ) {
      try {
        if (!patternCheck.emailCheck(emailInfo) || emailInfo.trim() === '') {
          return B1ndToast.showInfo('이메일 형식을 지켜주세요!');
        }

        if (!patternCheck.phoneCheck(phoneInfo) || phoneInfo.trim() === '') {
          return B1ndToast.showInfo('전화번호 형식을 지켜주세요!');
        }

        await patchMainProfile({
          email: emailInfo,
          profileImage: imageSrc,
          phone: phoneInfo,
        });

        B1ndToast.showSuccess('내 정보를 수정하셨습니다!');

        setTempProfileInfo({
          ...tempProfileInfo,
          email: emailInfo,
          profileImage: imageSrc,
          phone: phoneInfo,
        });

        setIsOpenMyInfoModifyModal((prev: boolean) => !prev);
      } catch (error) {
        B1ndToast.showError('내 정보를 수정하지 못했습니다!');
      }
    } else {
      B1ndToast.showInfo('내 정보를 수정해주세요!');
    }
  };

  return (
    <S.ProfileModifyModalBackground onClick={() => setIsOpenMyInfoModifyModal(false)}>
      <S.ProfileModifyModalWrap
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {classIsModifying && <MyInfoClassModifyModal setClassIsModifying={setClassIsModifying} />}

        <BiPlus
          className="exitIcon"
          style={{
            fontSize: '30px',
            transform: 'rotate(45deg)',
            position: 'absolute',
            top: '20px',
            right: '20px',
          }}
          onClick={() => {
            setIsOpenMyInfoModifyModal(false);
          }}
        />
        <S.MyInfoModifyModalTitleWrap>
          <S.MyInfoModifyTitleText>프로필 수정</S.MyInfoModifyTitleText>
          <S.MyInfoModifySubTitleText>대표 프로필과 이메일, 전화번호를 수정할 수 있습니다.</S.MyInfoModifySubTitleText>
        </S.MyInfoModifyModalTitleWrap>

        <S.ModalPictureChangeWrap>
          <S.ModalPictureChangeTitleText>프로필 사진</S.ModalPictureChangeTitleText>
          <S.ModalPictureWrap>
            <div>
              {isLoading ? (
                <>로딩중..</>
              ) : (
                <S.ModalPictureImg src={imageSrc === null || imageSrc === '' ? DODAM_DEFAULT_PROFILE : imageSrc} />
              )}
            </div>

            <S.PictureImageModifyLabel htmlFor="file_upload">
              <div className="btnStart">
                <img src={CAMERA_IMAGE} alt="btnStart" />
              </div>
            </S.PictureImageModifyLabel>
            <input
              style={{ display: 'none' }}
              type="file"
              id="file_upload"
              accept="image/jpg, image/png, image/jpeg"
              onChange={uploadImage}
            />
          </S.ModalPictureWrap>

          <S.PictureBecomeBasicImageBtn
            onClick={() => {
              setImageSrc(null);
            }}
          >
            기본 프로필로 변경
          </S.PictureBecomeBasicImageBtn>
        </S.ModalPictureChangeWrap>

        <S.ModifyBoxWrap>
          <S.ModifyBox>
            <S.ModifyBoxTitleText>학년 반 번호</S.ModifyBoxTitleText>
            <S.ModifyBoxInContents>
              <S.ModifyBoxContentText>
                {student?.grade || 0}학년 {student?.room || 0}반 {student?.number}번
              </S.ModifyBoxContentText>
              <S.EachModifyEventButton onClick={() => setClassIsModifying(true)}>수정</S.EachModifyEventButton>
            </S.ModifyBoxInContents>
          </S.ModifyBox>
          <S.ModifyBox>
            <S.ModifyBoxTitleText>이메일</S.ModifyBoxTitleText>
            {!emailIsModifying ? (
              <S.ModifyBoxInContents>
                <S.ModifyBoxContentText>{emailInfo}</S.ModifyBoxContentText>
                <S.EachModifyEventButton onClick={() => setEmailIsModifying((prev: boolean) => !prev)}>
                  수정
                </S.EachModifyEventButton>
              </S.ModifyBoxInContents>
            ) : (
              <S.ModifyBoxInContents>
                <S.ModifyBoxContentInput value={emailInfo} onChange={emailInfoHandler} />
                <S.EachModifyEventButton onClick={() => setEmailIsModifying((prev: boolean) => !prev)}>
                  취소
                </S.EachModifyEventButton>
              </S.ModifyBoxInContents>
            )}
          </S.ModifyBox>

          <S.ModifyBox>
            <S.ModifyBoxTitleText>전화번호</S.ModifyBoxTitleText>
            {!phoneIsModifying ? (
              <S.ModifyBoxInContents>
                <S.ModifyBoxContentText>{tempPhoneInfo}</S.ModifyBoxContentText>
                <S.EachModifyEventButton onClick={() => setPhoneIsModifying((prev: boolean) => !prev)}>
                  수정
                </S.EachModifyEventButton>
              </S.ModifyBoxInContents>
            ) : (
              <S.ModifyBoxInContents>
                <S.ModifyBoxContentInput value={tempPhoneInfo} onChange={phoneInfoHandler} maxLength={13} />
                <S.EachModifyEventButton onClick={() => setPhoneIsModifying((prev: boolean) => !prev)}>
                  취소
                </S.EachModifyEventButton>
              </S.ModifyBoxInContents>
            )}
          </S.ModifyBox>

          <S.ModifyEventButton onClick={updateInfo}>완료</S.ModifyEventButton>
        </S.ModifyBoxWrap>
      </S.ProfileModifyModalWrap>
    </S.ProfileModifyModalBackground>
  );
};

export default MyInfoModifyModal;
