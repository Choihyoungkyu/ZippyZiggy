import Button from '@/components/Button/Button';
import ProfileImage from '@/components/Image/ProfileImage';
import Title from '@/components/Typography/Title';
import { getPromptBookmarkAPI } from '@/core/prompt/promptAPI';
import { deleteUserAPI, getUserAPI, postUserLogoutAPI } from '@/core/user/userAPI';
import { setIsLogin, setUserReset } from '@/core/user/userSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { httpAuth } from '@/lib/http';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  width: 100%;
  height: 100vh;
  background-color: ${({ theme: { colors } }) => colors.whiteColor100};
`;

const ProfileHeaderContainer = styled.div`
  width: 100%;
  padding: 48px 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme: { colors } }) => colors.whiteColor100};
`;

const ProfilePromptContainer = styled.div`
  width: 100%;
  height: 480px;
  padding: 48px 48px;
  background-color: ${({ theme: { colors } }) => colors.bgColor};
`;

export default function Index() {
  const userState = useAppSelector((state) => state.user); // 유저정보
  const dispatch = useAppDispatch();
  const [nickname, setNickname] = useState('');
  const [profileImg, setProfileImg] = useState('');
  const router = useRouter();
  const { userUuid } = router.query;
  const paramUserUuid = typeof userUuid === 'string' ? userUuid : '';

  const handleUserAPI = async (uuid: string) => {
    const result = await getUserAPI(uuid);
    if (result?.result === 'SUCCESS') {
      setNickname(result?.nickname);
      setProfileImg(result?.profileImg);
    }
    const bookmarkResult = await getPromptBookmarkAPI(uuid, 1);
    if (bookmarkResult?.result === 'SUCCESS') {
      console.log(bookmarkResult);
    }
    if (result?.result === 'FAIL') {
      router.replace('/profile');
    }
  };

  // query undefine 없애기
  useEffect(() => {
    if (userUuid) {
      handleUserAPI(paramUserUuid);
    }
  }, [userUuid]);

  // 로그아웃
  const handleLogout = async () => {
    await postUserLogoutAPI();
    localStorage.clear();
    dispatch(setUserReset());
    router.push('/');
  };

  return (
    <ProfileContainer>
      <ProfileHeaderContainer>
        <ProfileImage src={profileImg} alt="프로필이미지" size={128} />
        <Title sizeType="2xl" margin="8px 0px">
          {nickname}
        </Title>
        {userState.userUuid === userUuid ? (
          <div>
            <Button
              display="inline-block"
              padding="4px 16px"
              margin="4px 0 0 0"
              onClick={handleLogout}
            >
              로그아웃
            </Button>

            <Link href="/account/modify">
              <Button display="inline-block" margin="4px 0 0 0">
                정보변경
              </Button>
            </Link>
          </div>
        ) : null}
      </ProfileHeaderContainer>
      <ProfilePromptContainer>
        <Title>프롬프트</Title>
        <br />
        <Button
          isRound
          display="inline-block"
          color="whiteColor100"
          fontColor="blackColor70"
          padding="0 24px"
          width="1"
        >
          {nickname}님의 프롬프트
        </Button>
        <Button
          isRound
          display="inline-block"
          color="whiteColor100"
          fontColor="blackColor70"
          margin="0 0 0 12px"
          padding="0 32px"
          width="1"
        >
          북마크
        </Button>
      </ProfilePromptContainer>
    </ProfileContainer>
  );
}