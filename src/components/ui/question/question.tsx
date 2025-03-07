import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../asset/sass/etc/question/question.scss';
import styled from 'styled-components';
import View from '../../../asset/image/view.svg';

// import { ACCESS_TOKEN } from '../../global/constants/index.ts';
import Tree from '../../../asset/image/nature-ecology-tree-3--tree-plant-cloud-shape-park.svg';
import Leaf from '../../../asset/image/leaf.svg';
import { CompanInfoProps } from '../../pages/searchPage/companyInfoPage.tsx';
import ChatAll from '../../../asset/image/chat2.svg';

const Line = styled.div`
  background-color: #f2f2f2;
  width: 102%;
  margin: 3% 0% 5% -1.5%;
`;

// const LoginButton = styled.button`
//   letter-spacing: -0.7px;
//   background-color: #ff8d1d !important;
//   border-radius: 3px;
//   font-weight: 600;
//   font-size: 12px;
//   margin: 2% 10% 0% 48%;
//   padding: 5px 5px;
//   width: 15%;
// `;

// const ContentBlur = styled.span`
//   ${({ isLoggedIn }) =>
//     !isLoggedIn &&
//     css`
//       display: -webkit-box;
//       -webkit-box-orient: vertical;
//       -webkit-line-clamp: 2;
//       overflow: hidden;
//       filter: blur(5px);
//       text-overflow: ellipsis;
//     `}
// `;

// const ContentBlur = styled.span<{ $isLoggedIn: boolean }>`
//   ${({ $isLoggedIn }) =>
//     !$isLoggedIn &&
//     css`
//       display: -webkit-box;
//       -webkit-box-orient: vertical;
//       -webkit-line-clamp: 2;
//       overflow: hidden;
//       filter: blur(5px);
//       text-overflow: ellipsis;
//     `}
// `;

function truncateTitle(title, maxLength = 25) {
  return title?.length > maxLength
    ? title?.substring(0, maxLength - 3) + '...'
    : title;
}

function formatDate(fullDate: string) {
  const date = new Date(fullDate);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

interface QuestionModulesProps {
  companyId?: string;
  questionId: number;
  questioner: string;
  questionerTag: string;
  answerCount: number;
  questionTitle: string;
  createAt: string;
  questionContent: string;
  reward: number;
  companyData: CompanInfoProps;
  viewCount: number;
}

function QuestionModule({
  companyId,
  questionId,
  questioner,
  answerCount,
  questionTitle,
  createAt,
  reward,
  questionerTag,
  companyData,
  viewCount,
}: QuestionModulesProps) {
  const navigate = useNavigate();

  const goToDetail = () => {
    navigate(`/company-info/${companyId}/${questionId}`, {
      state: {
        questionId,
      },
    });
  };

  const formattedDate = formatDate(createAt);

  return (
    <>
      <div className="question-container" onClick={goToDetail}>
        <span className="questioner">
          <img
            src={questionerTag === '취준생' ? Leaf : Tree}
            className={'questionar-icon'}
            alt="icon"
          />
          <span className="questionar-name-tag"> {questioner}</span>
          <span className="questionar-point-tag">•</span>
          <div className="questioner-container">
            <span className="questioner-tag">{formattedDate}</span>
          </div>
        </span>

        <div className="field">
          <div className="question-list-info">
            <div className="question-reward-container">
              <div className="reward">{reward}</div>
              <div className="question-title">
                {truncateTitle(questionTitle)}
              </div>
            </div>
            <div className="category-select-style">
              {companyData?.questions?.map(
                (question) => question.questionCategory,
              )}
            </div>
          </div>

          <div className="view-container">
            <img className="view-img" src={View} />
            <span className="chat-count">{viewCount}</span>
            <img className="chat-img" src={ChatAll} />
            <span className="chat-count">{answerCount}</span>
          </div>
        </div>
      </div>
      <Line />
    </>
  );
}

export default QuestionModule;
