import React, { useEffect, useRef, useState } from 'react';
import MyWishClassItem from './MyWishClassItem';
import { useQuery } from '@tanstack/react-query';
import { getMyWishClass } from '@/app/api/mypage/my-class-api';
import { useLoginStore } from '@/store/login/loginUserIdStore';
import { QueryKeys } from '@/constants/QueryKeys';
import Pagination from '@/components/common/Pagination';
import { useSearchParams } from 'next/navigation';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const MyWishClass = () => {
  const { loginUserId } = useLoginStore();
  const searchParams = useSearchParams();
  const page = searchParams.get('page');

  // 위시한 클래스 불러오기
  const { data: myWishClassList, isPending } = useQuery({
    queryKey: [QueryKeys.WISH_CHECK, loginUserId],
    queryFn: () => getMyWishClass(loginUserId),
    enabled: !!loginUserId
  });

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5; // 한 페이지당 보여줄 포스트의 개수
  // const responsiveHeightRef = useRef(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior:'smooth' });
    setCurrentPage(page && parseInt(page) > 0 ? parseInt(page) : 1); // 현재 페이지 업데이트
  }, [page]);

  // const handleMoveToTop= ()=>{
  //   if(responsiveHeightRef.current){
  //     responsiveHeightRef.current.scrollTop = 0 
  //   }
  // }

  if (isPending) {
    return (
      <div className="flex flex-col justify-center  items-center gap-4 min-h-100vh-header-default">
        <LoadingSpinner />
        <p>잠시만 기다려주세요..</p>
      </div>
    );
  }

  if (!myWishClassList || myWishClassList.length === 0) {
    return <div> 위시 리스트에 추가한 클래스가 없습니다.</div>;
  }

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = myWishClassList.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <ul className="flex flex-col gap-4 justify-center items-center md:p-4 md:justify-items-center w-full mb-24 md:mb-0">
      <p className="flex items-start text-xl text-dark-purple-color font-bold md:hidden justify-center">
        클래스 위시리스트
      </p>
      {currentPosts.map((classItem) => (
        <MyWishClassItem key={classItem.class_id} classItem={classItem} />
      ))}
      <Pagination
        totalItems={myWishClassList.length}
        itemCountPerPage={postsPerPage}
        pageCount={5}
        currentPage={currentPage}
        key={page}
       
      />
    </ul>
  );
};

export default MyWishClass;
