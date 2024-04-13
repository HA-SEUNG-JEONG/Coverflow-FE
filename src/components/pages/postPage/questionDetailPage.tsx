import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import '../../../asset/sass/pages/postPage/questionDetailPage.scss';
import { StyledPage, StyledHeader } from '../../../styledComponent';
import TitleHeader from '../../ui/header/titleHeader';
import Answer from '../../ui/question/answer.tsx';
import TabBar from '../../ui/tabBar/tabBar';
import { ACCESS_TOKEN } from '../../global/constants';
import Tree from '../../../asset/image/nature-ecology-tree-3--tree-plant-cloud-shape-park.svg';
import Reward from '../../../asset/image/reward.svg';
import Dot from '../../../asset/image/dots-vertical.svg';

import { showErrorToast, showSuccessToast } from '../../ui/toast/toast.tsx';
import { fetchAPI } from '../../global/utils/apiUtil.js';

const Questioner = styled.div`
  letter-spacing: -1px;
  margin-left: 2%;
`;

const QuestionTitle = styled.div`
  font-family: pretendard-semibold;
  letter-spacing: -1px;
  font-size: 30px;
  padding: 10px;
`;

const QuestionContent = styled.div`
  margin-top: 3%;
  margin-left: 2%;
  margin-bottom: 2%;
  letter-spacing: -1px;
  font-family: pretendard-light;
  line-height: 1.5;
`;

const FirstLine = styled.div`
  height: 1px;
  background-color: #cecece;
  width: 100%;
  margin: 5% 0% 0% 0%;
`;

// const LastLine = styled.div`
//   height: 0.5px;
//   background-color: #cecece;
//   width: 85%;
//   margin: 10% 0% 0% 9%;
// `;

const AnswerList = styled.div``;

export interface AnswerProps {
  answerId: string;
  answererTag: string;
  createAt: string;
  answerContent: string;
  answererNickname: string;
}

interface QuestionDetailProps {
  title: string;
  questionContent: string;
  answerCount: number;
  reward: number;
  questionerNickname: string;
  questionTag: string;
  createAt: string;
  answers: AnswerProps[];
  answerer?: string;
  companyName?: string;
  totalPages?: number;
  viewCount?: number;
  onAdopt?: () => void;
  content?: string;
}

export interface CommentProps {
  data: {
    answerCount: number;
    answers: {
      answerId: string;
      answererTag: string;
      createAt: string;
      answerContent: string;
      answererNickname: string;
    }[];
  };
}

function QuestionDetailPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  console.log('state: ', state);
  const answerRef = useRef<HTMLTextAreaElement>(null);
  const [postAnswer, setPostAnswer] = useState('');
  const [loadAnswer, setLoadAnswer] = useState<CommentProps>();
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [questionDetail, setQuestionDetail] = useState<QuestionDetailProps[]>([
    {
      title: '',
      questionContent: '',
      answerCount: 0,
      reward: 0,
      questionerNickname: '',
      questionTag: '',
      createAt: '',
      answers: [],
      companyName: '',
      totalPages: 0,
      viewCount: 0,
    },
  ]);

  const { questionId } = useParams();

  useEffect(() => {
    const fecthQuestionDetail = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);

      if (!token) {
        showErrorToast('로그인이 필요합니다.');
        navigate(-1);
      }

      const res = await fetchAPI(
        `/api/question/${questionId}?pageNo=3`,
        'GET',
        null,
      );
      const {
        answerCount,
        answers,
        companyName,
        questionContent,
        createAt,
        questionTag,
        questionTitle,
        questionerNickname,
        reward,
        totalPages,
        viewCount,
      } = res.data;

      setQuestionDetail([
        {
          title: questionTitle,
          questionContent,
          answerCount,
          reward,
          questionerNickname,
          questionTag,
          createAt,
          answers: answers.map((answer: AnswerProps) => ({
            answerId: answer.answerId,
            answererNickname: answer.answererNickname,
            answererTag: answer.answererTag,
            createAt: answer.createAt,
            answerContent: answer.answerContent,
          })),
          companyName,

          totalPages,
          viewCount,
        },
      ]);
    };
    fecthQuestionDetail();
  }, [postAnswer]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleAnswerSubmit = async () => {
    const requestData = {
      content: answerRef.current ? answerRef.current.value : '',
      questionId: Number(questionId),
    };

    const answerer =
      questionDetail &&
      questionDetail.map((detail) => detail.questionerNickname);
    console.log('answerer: ', answerer);

    if (state.questioner === answerer[0]) {
      showErrorToast('본인의 질문에 답변을 달 수 없습니다.');
      return;
    }

    const data = await fetchAPI('/api/answer', 'POST', requestData);

    if (
      state.questioner !== answerer[0] &&
      data.statusCode === 'CREATED' &&
      answerRef.current
    ) {
      setPostAnswer(answerRef.current?.value);
      showSuccessToast('답변이 등록되었습니다.');
    }
  };

  const toggleReportPopup = () => {
    setShowReportPopup((isToggled) => !isToggled);
  };

  const handleReportSubmit = async () => {
    toggleReportPopup();
    await fetchAPI(`/api/report`, 'POST', {
      content: state.questionContent,
      type: 'QUESTION',
      id: state.questionId,
    });
  };

  useEffect(() => {
    const fetchComment = async () => {
      const response = await fetchAPI(
        `/api/question/${questionId}?pageNo=0&criterion=createdAt`,
        'GET',
        null,
      );
      setLoadAnswer(response);
    };
    fetchComment();
  }, []);

  return (
    <StyledPage className="main-page-container">
      <StyledHeader>
        <TitleHeader pageTitle="상세보기" handleGoBack={handleGoBack} />
      </StyledHeader>

      <div className="question-detail-container">
        <div className="job-info">
          <img src={Tree} alt="" />
          <span>
            {state.questionerTag === '취준생'
              ? `${state.questionerTag}이 남긴 글이에요.`
              : `${state.questionerTag}가 남긴 질문이에요.`}
          </span>

          <img onClick={toggleReportPopup} src={Dot} alt="dot" />
        </div>
        <QuestionTitle>{state.questionTitle}</QuestionTitle>
        <div className="questioner-info">
          <Questioner>
            {state.questioner || 'Anonymous'} <span className="middle">•</span>
            <span className="question-date">{state.createAt}</span>
          </Questioner>
        </div>

        <QuestionContent>{state.questionContent}</QuestionContent>
        <div className="company-fish-tag">
          <div className="detailpage-company">{state.companyName}</div>
          <div className="detailpage-fishbuncount">
            <img src={Reward} alt="reward" />
            {state.reward}
          </div>
        </div>
        <FirstLine />
        {showReportPopup && (
          <div className="report-popup-overlay">
            <div className="report-popup">
              <div className="report-title">사용자 신고</div>
              <div className="report-sub-title">사유 선택</div>

              <label>
                <input type="checkbox" name="reason" value="reason1" /> 욕설
                혹은 비방표현이 있어요
              </label>
              <label>
                <input type="checkbox" name="reason" value="reason2" /> 개인정보
                노출 게시물이에요
              </label>
              <label>
                <input type="checkbox" name="reason" value="reason3" /> 불법
                정보를 포함하고 있어요
              </label>
              <label>
                <input type="checkbox" name="reason" value="reason4" /> 스팸
                혹은 홍보성 도배글이에요
              </label>
              <label>
                <input type="checkbox" name="reason" value="reason5" /> 특정
                이용자가 질문, 답변, 채택을 반복해요
              </label>

              <div className="reportBtn">
                <button
                  className="close-report-popup"
                  onClick={toggleReportPopup}
                >
                  닫기
                </button>
                <button className="submit-report" onClick={handleReportSubmit}>
                  신고하기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="comment-section">
        <textarea
          placeholder="답변을 입력해주세요.."
          className="comment-input"
          rows={4}
          ref={answerRef}
        ></textarea>
        <button className="submit-comment" onClick={handleAnswerSubmit}>
          등록
        </button>
      </div>
      {/* <LastLine /> */}

      <AnswerList>
        <div className="answer-title">답변 {loadAnswer?.data.answerCount}</div>
        {loadAnswer?.data.answers.map((detail) => (
          <>
            <Answer
              createAt={detail.createAt}
              answerContent={detail.answerContent}
              answererNickname={detail.answererNickname}
              answererTag={detail.answererTag}
            />
          </>
        ))}
      </AnswerList>
      <TabBar />
    </StyledPage>
  );
}

export default QuestionDetailPage;
