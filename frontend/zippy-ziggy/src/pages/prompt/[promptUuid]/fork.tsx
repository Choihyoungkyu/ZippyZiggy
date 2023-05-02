import CreateFooter from '@/components/CreatePrompt/CreateFooter';
import CreatePart1 from '@/components/CreatePrompt/CreatePrompt_1';
import CreatePart2 from '@/components/CreatePrompt/CreatePrompt_2';
import { createPromptFork, getPromptDetail } from '@/core/prompt/promptAPI';
import { useAppSelector } from '@/hooks/reduxHook';
import { checkInputFormToast } from '@/lib/utils';
import { ContainerTitle, TitleInfoWrapper, TitleWrapper } from '@/styles/prompt/Create.style';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiFillQuestionCircle } from 'react-icons/ai';
import styled from 'styled-components';

const FooterBox = styled.div`
  display: block;
  height: 4.25rem;
`;

// type DataType = {
//   data: {
//     category: string;
//     description: string;
//     isBookmarked: boolean;
//     isForked: boolean;
//     isLiked: boolean;
//     likeCnt: number;
//     messageResponse: {
//       example: string;
//       prefix: string;
//       suffix: string;
//     };
//     originerResponse: {
//       originerImg: string;
//       originerNickname: string;
//       originerUuid: string;
//     } | null;
//     regDt: number;
//     thumbnail: string;
//     title: string;
//     updDt: SVGNumber;
//     writerResponse: {
//       writerImg: string;
//       writerNickname: string;
//       writerUuid: string;
//     };
//   };
//   result: string;
// };

export default function PromptUpdate() {
  const [isNext, setIsNext] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { nickname } = useAppSelector((state) => state.user);
  const router = useRouter();
  const { promptUuid } = router.query;
  const fork = true;

  const initialState = {
    prompt1: '',
    prompt2: '',
    example: '',
    title: '',
    content: '',
    image: null,
    category: '',
  };

  // react-hook-form 설정
  const { setValue, getValues, watch } = useForm({
    defaultValues: initialState,
    mode: 'onChange',
  });
  const [prompt1, prompt2, example, title, content, category, image] = getValues([
    'prompt1',
    'prompt2',
    'example',
    'title',
    'content',
    'category',
    'image',
  ]);

  // URL의 이미지 다운로드
  async function getFile(url: string) {
    const {
      data: { type, arrayBuffer },
    } = await axios.get('/api/file', { params: { url } });

    const blob = new Blob([Uint8Array.from(arrayBuffer)], { type });
    const arr = url.split('/');
    const FileList = [
      new File([blob], arr[arr.length - 1], {
        type: `image/${arr[arr.length - 1].split('.')[1]}`,
      }),
    ];
    setValue('image', FileList);
    // <a> 태그의 href 속성값으로 들어갈 다운로드 URL
    const downloadUrl = window.URL.createObjectURL(blob);
    return downloadUrl;
  }

  // Prompt 상세 요청 API
  const handleGetPromptDetail = async () => {
    const res = await getPromptDetail({ promptUuid });
    return res;
  };

  const { data, isLoading } = useQuery(['prompt', promptUuid], handleGetPromptDetail, {
    enabled: !!promptUuid,
  });

  useEffect(() => {
    watch();
    if (!isLoading) {
      setValue('prompt1', data?.data?.messageResponse?.prefix || '');
      setValue('prompt2', data?.data?.messageResponse?.suffix || '');
      setValue('example', data?.data?.messageResponse?.example || '');
      setValue('title', data?.data?.title);
      setValue('content', data?.data?.description);
      setValue('category', data?.data?.category);
      if (!fork) {
        setPreview(data?.data?.thumbnail);
        getFile(data?.data?.thumbnail);
      }
    }
  }, [isLoading]);

  // textarea 높이 변경
  const handleChange = (e, value) => {
    setValue(value, e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  // category 설정
  const handleSetCategory = (e) => {
    setValue('category', e.target.dataset.value);
  };

  // 이미지 변경
  const handleSetImage = (e) => {
    setValue('image', e.target.files);
  };

  // 페이지내 요소 바꿈(page1, page2)
  const handleNext = () => {
    setIsNext((prev) => !prev);
  };

  // 유효성 검사
  const handleCheck = () => {
    if (prompt1 === '' && prompt2 === '' && example === '') {
      checkInputFormToast();
      return false;
    }
    if (title === '' || content === '' || category === '' || image === null) {
      checkInputFormToast();
      return false;
    }
    return true;
  };

  // 포크 생성 요청
  const handleCreatePromptFork = async () => {
    handleCheck();
    try {
      const tmpData = {
        title,
        description: content,
        category,
        message: {
          prefix: prompt1,
          example,
          suffix: prompt2,
        },
      };
      const formData = new FormData();
      formData.append('thumbnail', image ? image[0] : null);
      formData.append('data', new Blob([JSON.stringify(tmpData)], { type: 'application/json' }));
      const requestData = {
        id: promptUuid,
        data: formData,
        router,
      };
      console.log(tmpData);
      createPromptFork(requestData);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <ContainerTitle>
        <TitleWrapper isNext={isNext}>
          <div className="title">프롬프트 포크</div>
          <div className="help">
            <AiFillQuestionCircle className="icon" />
            <div>포크가 처음이신가요?</div>
          </div>
        </TitleWrapper>
        {/* prompt.forkCnt > 0 으로 확인하도록 바꾸기!! */}
        {fork ? (
          <TitleInfoWrapper>
            <div className="fork">포크</div>
            <div className="forkName">{data?.data?.title}</div>
            <div className="userName">{data?.data?.writerResponse?.writerNickname}</div>
          </TitleInfoWrapper>
        ) : (
          <TitleInfoWrapper>
            <div className="userName">작성자 : {nickname}</div>
          </TitleInfoWrapper>
        )}
      </ContainerTitle>
      {isNext ? (
        <CreatePart2
          title={title}
          content={content}
          handleChange={handleChange}
          setImage={handleSetImage}
          preview={preview}
          setPreview={setPreview}
          category={category}
          handleSetCategory={handleSetCategory}
        />
      ) : (
        <CreatePart1
          possible
          prompt1={prompt1}
          prompt2={prompt2}
          example={example}
          handleChange={handleChange}
        />
      )}
      <FooterBox />
      <CreateFooter
        isNext={isNext}
        fork
        handleNext={handleNext}
        handlePrompt={handleCreatePromptFork}
      />
    </>
  );
}
