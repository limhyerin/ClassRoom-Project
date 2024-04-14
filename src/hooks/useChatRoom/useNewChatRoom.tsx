import {
  createChatRoom,
  createNewMessages,
  createNewMessagesPhoto,
  getChatMessages,
  getChatRooms,
  getLastChatMessage,
  getMakeClassUser,
  readCheckMessages,
  readCheckMessagesAll
} from '@/app/api/chatRooms/getChatRooms';
import { SendNewMessageType, SendNewPhotoMessageType } from '@/types/chat/chatTypes';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

//채팅방 목록 읽어오기
export function useReadChatRooms(loginUserId: string) {
  const { data: chatroomsInfo } = useQuery({
    queryKey: ['chatRooms', loginUserId],
    queryFn: () => getChatRooms(loginUserId as string),
    enabled: !!loginUserId
  });
  return { chatroomsInfo };
}

// 상대방 프로필, 닉네임 가져오기
export function useReadMakeClassUserInfo(otherUserId: string) {
  const { data: MakeClassUserInfo } = useQuery({
    queryKey: ['MakeClassUser', otherUserId],
    queryFn: () => getMakeClassUser(otherUserId as string),
    enabled: !!otherUserId
  });
  return { MakeClassUserInfo };
}

//채팅방 생성하기
export function useCreateNewRoom() {
  const queryClient = useQueryClient();

  const { mutate: createNewRoomMutate } = useMutation({
    mutationFn: async ({
      toClassId,
      fromUserId,
      teacherUserId
    }: {
      toClassId: string;
      fromUserId: string;
      teacherUserId: string;
    }) => {
      await createChatRoom({ toClassId, fromUserId, teacherUserId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
    }
  });

  return { createNewRoomMutate };
}

//채팅내용 가져오기
export function useReadChatRoomMessages(chatId: string, loginUserId: string) {
  const { data: readChatRoomMessages } = useQuery({
    queryKey: ['chatMessage', chatId],
    queryFn: () => getChatMessages(chatId as string, loginUserId as string),
    enabled: !!chatId
  });
  return { readChatRoomMessages };
}

//채팅방 메시지 보내기
export function useCreateNewMessage() {
  const queryClient = useQueryClient();

  const { mutate: createNewMessageMutate } = useMutation({
    mutationFn: async ({ chatId, message, loginUserId }: SendNewMessageType) => {
      await createNewMessages({ chatId, loginUserId, message });
    },
    onSuccess: (_, { chatId }) => {
      // 해당 채팅방의 메시지 리스트를 갱신
      queryClient.invalidateQueries({ queryKey: ['chatMessage', chatId] });
      // 최근 메시지를 갱신
      queryClient.invalidateQueries({ queryKey: ['lastMessage', chatId] });
      // 메시지 카운트 갱신
      queryClient.invalidateQueries({ queryKey: ['countMessage', chatId] });
    }
  });

  return { createNewMessageMutate };
}

//채팅방 이미지 보내기
export function useCreateNewPhotoMessage() {
  const queryClient = useQueryClient();

  const { mutate: createNewPhotoMessageMutate } = useMutation({
    mutationFn: async ({ chatId, photos, loginUserId }: SendNewPhotoMessageType) => {
      await createNewMessagesPhoto({ chatId, loginUserId, photos });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatMessage'] });
    }
  });

  return { createNewPhotoMessageMutate };
}

//마지막 메시지 가져오기
export function useReadLastMessages(chatId: string) {
  const { data: readLastMessages } = useQuery({
    queryKey: ['lastMessage', chatId],
    queryFn: () => getLastChatMessage(chatId as string),
    enabled: !!chatId
  });
  return { readLastMessages };
}

//방별로 채팅 안읽은 개수 값 가져오기
export function useReadCheckMessages(chatId: string, loginUserId: string) {
  const { data: readleftChekcMessages } = useQuery({
    queryKey: ['countMessage', chatId],
    queryFn: () => readCheckMessages(chatId as string, loginUserId as string),
    enabled: !!chatId
  });
  return { readleftChekcMessages };
}

//읽지않은 전체 채팅 개수 가져오기
export function useReadCheckMessageAll(loginUserId: string) {
  const { data: readLeftChekcMessageAll } = useQuery({
    queryKey: ['countMessage', loginUserId],
    queryFn: () => readCheckMessagesAll(loginUserId as string),
    enabled: !!loginUserId
  });
  return { readLeftChekcMessageAll };
}
