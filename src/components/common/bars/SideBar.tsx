import React, { PropsWithChildren } from 'react';
import Category from './Category';
import Link from 'next/link';
const SideBar = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="fixed p-3 top-0 border-gray-300 border-solid border-[1px] bottom-0 flex flex-col justify-between items-center left-0 w-[100px] z-50">
        <div className="mt-[5vh] flex flex-col">
          <Category />
          <Link href={'/'} className="p-5">
            Home
          </Link>
          <Link href={'/chat'} className="p-5">
            chat
          </Link>
          <Link href={'/mypage'} className="p-5">
            mypage
          </Link>
          <Link href={'/register'} className="p-5">
            create
          </Link>
          <Link href="/hello">로그인</Link>
          {/* 예약 페이지 확인을 위한 임시 링크 */}
          <Link href="/reserve?classId=c3d4e5f6-0000-4aeb-bcf5-6fa40fc0b0e3">예약하기(임시)</Link>
        </div>
        <div>
          <div className="p-5">convert</div>
          <div className="p-5">logout</div>
        </div>
      </div>

      <div className="flex-1 ml-[100px]">{children}</div>
    </>
  );
};

export default SideBar;
