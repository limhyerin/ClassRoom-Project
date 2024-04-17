'use client';

import { checkUserNickname, updateUserInfo } from '@/app/api/mypage/user-api';
import { useLoginStore } from '@/store/login/loginUserIdStore';
import { userInfoStore } from '@/store/mypage/userInfoStore';
import { UpdateUserInfoType } from '@/types/user';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { changeInfoNotify, noChangedNotify } from '../common/Toastify';
import EditProfileImage from './EditProfileImage';

const EditProfile = () => {
  const { loginUserId } = useLoginStore();
  const userId = loginUserId as string;

  const queryClient = useQueryClient();

  // zustand로 userInfo 상태 관리
  const { userInfo, setUserInfo } = userInfoStore();

  const [newNickname, setNewNickname] = useState('');
  const [newProfileImage, setNewProfileImage] = useState('');
  const [isEditing, setIsEditing] = useState(false); // 수정된 사항 확인 여부
  const [isAvailableNickname, setIsAvailableNickname] = useState(true); // 닉네임 중복 여부 상태 업데이트
  const [isActiveBtn, setIsActiveBtn] = useState(false); // 수정 완료시 버튼 활성화 상태

  useEffect(() => {
    if (userInfo) {
      setNewNickname(userInfo.nickname || '');
      setNewProfileImage(userInfo.profile_image || '');
    }
  }, [userInfo]);

  // 닉네임 수정
  const handleOnChangeNickname = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNickname = e.target.value;
    setNewNickname(newNickname); // 새로 작성한 닉네임

    const isAvailable = !(await checkUserNickname({ newNickname }, userId));
    setIsAvailableNickname(isAvailable); // 중복 여부 상태 업데이트

    // 이미 존재하는 닉네임을 입력한 경우 수정 완료 버튼 비활성화
    setIsActiveBtn(!isAvailable);
  };

  // 유저 정보 수정하기 : useMutation
  const { mutate: updateUserInfoMutation } = useMutation({
    mutationFn: ({ newNickname, newProfileImage }: UpdateUserInfoType) =>
      updateUserInfo({ newNickname, newProfileImage }, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user']
      });
      setIsEditing(false);
    }
  });

  // 수정하기 버튼 -> supabase에 수정한 정보 update
  const handleOnClickEditProfileBtn = () => {
    // 수정된 사항이 없는 경우
    const isNicknameChanged = newNickname !== userInfo?.nickname;
    const isProfileImageChanged = newProfileImage != userInfo?.profile_image;

    if (!isNicknameChanged && !isProfileImageChanged) {
      noChangedNotify();
      return;
    } else {
      // 수정된 사항이 있는 경우
      changeInfoNotify();
      updateUserInfoMutation({ newNickname, newProfileImage });
      setUserInfo({
        userId: userInfo.userId,
        nickname: newNickname,
        email: userInfo.email,
        profile_image: newProfileImage,
        isTeacher: userInfo.isTeacher
      });
      // alert('프로필 수정이 완료되었습니다.');
    }
  };

  // 취소하기 버튼
  const handleOnClickCancleBtn = () => {
    if (isEditing) {
      const confirm = window.confirm('취소하시겠습니까?');
      if (confirm) {
        setIsEditing(false);
        setNewNickname(userInfo?.nickname || '');
        setNewProfileImage(userInfo?.profile_image || '');
        setIsAvailableNickname(true);
        setIsActiveBtn(false);
      }
    }
  };

  // if (isPending) {
  //   return <div> 로딩중 ... </div>;
  // }

  if (!userInfo) {
    return <div> 유저 정보가 없습니다.</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center bg-light-purple w-[960px] p-4">
      <p className="flex items-start text-xl text-dark-purple-color font-bold">프로필 수정하기</p>
      <div className="flex gap-10 justify-center items-center">
        <div className="flex flex-col justify-center items-center">
          <EditProfileImage
            newProfileImage={newProfileImage}
            setNewProfileImage={setNewProfileImage}
            isEditing={isEditing}
            userInfo={userInfo}
          />
        </div>
        <div>
          <div className="flex flex-col">
            <div className="m-4 p-4 gap-4">
              <p className="text-text-dark-gray font-bold">닉네임</p>
              {isEditing ? (
                <input
                  type="text"
                  placeholder="닉네임을 입력하세요."
                  className="input input-bordered w-[250px] max-w-xs border-point-purple shadow-md"
                  value={newNickname}
                  onChange={handleOnChangeNickname}
                  maxLength={20}
                />
              ) : (
                <p>{newNickname}</p>
              )}
              {isAvailableNickname ? (
                ''
              ) : (
                <p className="font-thin p-2">이미 사용중인 닉네임입니다. 다른 닉네임을 입력해주세요.</p>
              )}
            </div>
            <div className="m-4 p-4">
              <p className="text-text-dark-gray font-bold">이메일</p>
              <p>{userInfo?.email}</p>
            </div>
          </div>
        </div>
      </div>{' '}
      <div className="m-4 p-4 flex gap-4">
        <button onClick={handleOnClickCancleBtn} className="btn w-[100px] ">
          취소하기
        </button>
        {isEditing ? (
          <div>
            <button
              onClick={handleOnClickEditProfileBtn}
              className="btn w-[100px]  bg-dark-purple-color text-white"
              disabled={isActiveBtn}
            >
              수정 완료
            </button>
          </div>
        ) : (
          <button onClick={() => setIsEditing(true)} className="btn w-[100px]  bg-dark-purple-color text-white">
            수정하기
          </button>
        )}
      </div>
    </div>
  );
};

export default EditProfile;