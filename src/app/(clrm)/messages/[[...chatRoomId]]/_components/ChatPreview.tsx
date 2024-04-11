import { useReadMakeClassUserInfo } from '@/hooks/useChatRoom/useNewChatRoom';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

//데이터 불러오기,

export default function ChatPreview({
  chatId,
  // createdAt,
  // toClassId,
  title,
  // makeClassUserId,
  otherId
}: any) {
  const { MakeClassUserInfo } = useReadMakeClassUserInfo(otherId);
  console.log(MakeClassUserInfo?.profile_image);
  console.log('아덜', otherId);

  return (
    <Link href={`/messages?chatId=${chatId}&otherId=${otherId}&title=${title}`} prefetch={false} shallow>
      <div className="flex py-4 hover:bg-[#E3E1FC] mt-2 mb-2 px-2">
        <div className="mx-3">
          <img
            src={MakeClassUserInfo?.profile_image}
            alt="profileImg"
            width={50}
            height={50}
            className="border border-black rounded-full"
          />
        </div>
        <div className="flex flex-col mx-3 flex-1 w-0">
          <p className="sm:text-sm md:text-lg font-bold text-nowrap">{MakeClassUserInfo?.nickname}</p>
          <div className="truncate">
            <p className="sm:text-sm text-gray-500">메시지</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="w-11/12 border-b-2" />
      </div>
    </Link>
  );
}
