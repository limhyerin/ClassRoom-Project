import React, { useState } from 'react';
import EditTeacherInfo from './EditTeacherInfo';
import EditProfile from '../EditProfile';
import MyClass from './MyClass';
import { UserType } from '@/types/user';

const TeacherMyPage = () => {
  const [activePage, setActivePage] = useState('editProfile');

  return (
    <div className="m-4 p-4">
      <div className="gap-4">
        <span
          onClick={() => setActivePage('editProfile')}
          className={`p-4 m-4 ${activePage === 'editProfile' ? 'font-bold cursor-pointer' : ''}`}
        >
          프로필 수정하기
        </span>
        <span
          onClick={() => setActivePage('editTeacherInfo')}
          className={`p-4 m-4 ${activePage === 'editTeacherInfo' ? 'font-bold cursor-pointer' : ''}`}
        >
          선생님 정보 수정하기
        </span>
        <span
          onClick={() => setActivePage('myClass')}
          className={`p-4 m-4 ${activePage === 'myClass' ? 'font-bold cursor-pointer' : ''}`}
        >
          내가 등록한 클래스
        </span>
      </div>
      <div className="m-4 p-4">
        {activePage === 'editProfile' ? (
          <EditProfile />
        ) : activePage === 'editTeacherInfo' ? (
          <EditTeacherInfo />
        ) : activePage === 'myClass' ? (
          <MyClass />
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default TeacherMyPage;
