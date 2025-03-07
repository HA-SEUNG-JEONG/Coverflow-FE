import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import TitleHeader from '../../ui/header/titleHeader.tsx';
import TabBar from '../../ui/tabBar/tabBar.tsx';
import '../../../asset/sass/pages/searchPage/companyInfoPage.scss';
import Question from '../../ui/question/question.tsx';
import { ACCESS_TOKEN, BASE_URL } from '../../global/constants/index.ts';
import { StyledHeader, StyledPage } from '../../../styledComponent.ts';
import SearchInput from '../../ui/searchInput/searchInput.tsx';
import { showErrorToast } from '../../ui/toast/toast.tsx';
import axios from 'axios';
import Pagination from '../../ui/Pagination.tsx';
import '../../../asset/sass/pages/notificationPage/notificationList.scss';
import NoContentsComponent from '../../ui/noContentsComponent/noContentsComponent.tsx';
// import Hot from '../../../asset/image/hot.svg';

const CompanyContainer = styled.div`
  background-color: #ffffff;
  margin: 5% 0% 5% 15%;
  padding: 0px;
  /* border: 1.5px solid #ff8d1d; */
  width: 70%;
  display: flex;
  border-radius: 10px;
`;

const CompanyName = styled.div`
  font-size: 3rem;
  letter-spacing: -1px;
  font-weight: 800;
  margin-bottom: 0.6rem;
  font-family: 'Pretendard-ExtraBold';
  span {
    font-size: 1.4rem;
    color: #474646;
    font-family: 'Pretendard-Medium';
    letter-spacing: -1px;
  }
`;

// const CompanyType = styled.div`
//   font-size: 13px;
//   color: cecece;
//   letter-spacing: -1px;
//   margin-top: 3%;
// `;

const Line = styled.div`
  height: 5px;
  background-color: #fff9f4;
  width: 100%;
  margin: 5% 0% 8% 0%;
  stroke: 5px solid #fff9f4;
`;

// const CompanyAddress = styled.div`
//   margin-right: 12%;
// `;

const QuestionButton = styled.button`
  letter-spacing: -0.7px;
  background-color: #ff8d1d !important;
  /* border-radius: 3px; */
  margin: 5% -2% 0% 0%;
  font-weight: 600;
  font-size: 18px;
  width: 105px;
  height: 35px;
  border-radius: 2px;
  font-size: 1.6rem;
  color: #ffffff;
  letter-spacing: -1px;
  font-family: 'Pretendard-SemiBold';
`;

const QuestionList = styled.div`
  overflow: visible;
`;

// ================================================================

interface Questions {
  answerCount: number;
  createAt: string;
  questionCategory: string;
  questionContent: string;
  questionId: number;
  questionTag: string;
  questionTitle: string;
  questionViewCount: number;
  questionerNickname: string;
  questionerTag: string;
  reward: number;
}

export interface CompanInfoProps {
  companyAddress: string;
  companyId: number;
  companyName: string;
  companyType: string;
  questionCount: number;
  questions: Questions[];
}

function CompanyInfoPage() {
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState<CompanInfoProps>();

  const { companyId } = useParams();
  const [questionsCount, setQuestionsCount] = useState(0);
  const [allQuestions, setAllQuestions] = useState<CompanInfoProps>();

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [selectedCategories, setSelectedCategories] = useState(['']);

  const handleCategoryClick = async (category: string) => {
    const getCategoryClick = (category: string) => {
      switch (category) {
        case '사내문화':
          return 'CULTURE';
        case '급여연봉':
          return 'SALARY';
        case '업무방식':
          return 'BUSINESS';
        case '승진커리어':
          return 'CAREER';
        case '직무워라밸':
          return 'WORKLIFEBALANCE';
        default:
          return '';
      }
    };

    const selectedCategory = getCategoryClick(category);

    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter((item) => item !== category),
      );
      // 같은 카테고리를 중복해서 클릭했을 때는 `${BASE_URL}/api/company/${companyId}?pageNo=0&criterion=createdAt`으로 전체 질문 조회
      const { data } = await axios.get(
        `${BASE_URL}/api/company/${companyId}?pageNo=${currentPage}&criterion=createdAt`,
      );
      setQuestionsCount(data.data.questionCount);
      setAllQuestions(data.data);
    } else {
      setSelectedCategories([category]);

      try {
        const { data } = await axios.get(
          `${BASE_URL}/api/company/${companyId}?pageNo=0&criterion=createdAt&questionTag=${selectedCategory}`,
        );

        if (data) {
          setCompanyData(data.data);
          setQuestionsCount(data.data.totalElements);
        } else {
          throw new Error('데이터가 존재하지 않습니다.');
        }
      } catch (error) {
        if (error instanceof Error) showErrorToast(error.message);
        navigate(-1);
      }
    }
  };

  localStorage.setItem('prevPage', window.location.pathname);

  const handlePagination = (direction: string | number) => {
    if (direction === 'prev' && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else if (direction === 'next' && currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    } else if (typeof direction === 'number') {
      setCurrentPage(direction);
    }
  };

  useEffect(() => {
    async function fetchCompanyData() {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/api/company/${companyId}?pageNo=${currentPage}&criterion=createdAt`,
        );

        if (data) {
          setCompanyData(data.data);
          setTotalPages(data.data.totalPages);
          setQuestionsCount(data.data.questionCount);
        } else {
          throw new Error('데이터가 존재하지 않습니다.');
        }
      } catch (error) {
        if (error instanceof Error) showErrorToast(error.message);
        navigate(-1);
      }
    }

    fetchCompanyData();
  }, [companyId, currentPage]);

  const handleQuestionClick = () => {
    const token = localStorage.getItem(ACCESS_TOKEN);

    if (token) {
      navigate(`/company-info/${companyId}/question-write`, {
        state: companyData?.companyName,
      });
    } else if (confirm('로그인이 필요합니다. 로그인 하시겠습니까?') === true) {
      navigate(`/login`);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <StyledPage className="main-page-container">
      <StyledHeader>
        <TitleHeader pageTitle="기업 상세" handleGoBack={handleGoBack} />

        <SearchInput />
      </StyledHeader>

      {companyData && (
        <>
          <CompanyContainer>
            <div className="company">
              <div className="main-company-info">
                <CompanyName>{companyData?.companyName}</CompanyName>
                <span className="company-info-question">
                  에 관련된 질문들을 모아봤어요
                </span>
              </div>
              <QuestionButton onClick={handleQuestionClick}>
                질문하기
              </QuestionButton>
            </div>
          </CompanyContainer>
          <div className="selected-category-container">
            <div className="selected-category-wrapper">
              <div
                onClick={() => handleCategoryClick('사내문화')}
                className={`selected-category-item ${selectedCategories.includes('사내문화') ? 'active' : ''}`}
              >
                {/* {selectedCategories.includes('사내문화') && (
                  <img className="hot-image" src={Hot} alt="Hot" />
                )} */}
                <span>사내</span>
                <span>문화</span>
              </div>

              <div
                onClick={() => handleCategoryClick('급여연봉')}
                className={`selected-category-item ${selectedCategories.includes('급여연봉') ? 'active' : ''}`}
              >
                {/* {selectedCategories.includes('급여연봉') && (
                  <img className="hot-image" src={Hot} alt="Hot" />
                )} */}
                <span>급여</span>
                <span>연봉</span>
              </div>
              <div
                onClick={() => handleCategoryClick('업무방식')}
                className={`selected-category-item ${selectedCategories.includes('업무방식') ? 'active' : ''}`}
              >
                {/* {selectedCategories.includes('업무방식') && (
                  <img className="hot-image" src={Hot} alt="Hot" />
                )} */}
                <span>업무</span>
                <span>방식</span>
              </div>
            </div>
            <div className="selected-category-wrapper">
              <div
                onClick={() => handleCategoryClick('승진커리어')}
                className={`selected-category-item ${selectedCategories.includes('승진커리어') ? 'active' : ''}`}
              >
                {/* {selectedCategories.includes('승진커리어') && (
                  <img className="hot-image" src={Hot} alt="Hot" />
                )} */}
                <span>승진</span>

                <span>커리어</span>
              </div>
              <div
                onClick={() => handleCategoryClick('직무워라밸')}
                className={`selected-category-item ${selectedCategories.includes('직무워라밸') ? 'active' : ''}`}
              >
                {/* {selectedCategories.includes('직무워라밸') && (
                  <img className="hot-image" src={Hot} alt="Hot" />
                )} */}
                <span>직무</span>
                <span>워라밸</span>
              </div>
            </div>
          </div>
          <Line />

          <div className="question-info-container">
            <div className="company-question-title">
              <span>질문</span>
              <div className="question-count">{questionsCount}</div>
            </div>
          </div>

          {selectedCategories.length === 0 ? (
            <QuestionList>
              {allQuestions?.questions.map((question, index) => (
                <Question
                  key={index}
                  companyId={companyId}
                  questionId={question.questionId}
                  questioner={question.questionerNickname}
                  questionerTag={question.questionerTag}
                  answerCount={question.answerCount}
                  questionTitle={question.questionTitle}
                  questionContent={question.questionContent}
                  createAt={question.createAt}
                  reward={question.reward}
                  companyData={companyData}
                  viewCount={question.questionViewCount}
                />
              ))}
            </QuestionList>
          ) : companyData.questions.length > 0 ? (
            <QuestionList>
              {companyData.questions.map((question, index) => (
                <Question
                  key={index}
                  companyId={companyId}
                  questionId={question.questionId}
                  questioner={question.questionerNickname}
                  questionerTag={question.questionerTag}
                  answerCount={question.answerCount}
                  questionTitle={question.questionTitle}
                  questionContent={question.questionContent}
                  createAt={question.createAt}
                  reward={question.reward}
                  companyData={companyData}
                  viewCount={question.questionViewCount}
                />
              ))}
            </QuestionList>
          ) : (
            <NoContentsComponent
              onClick={handleQuestionClick}
              content1="해당 기업에 대한 질문이"
              content2="존재하지 않습니다"
              theme="질문을 남기고, 답변을 확인해 보세요!"
              className="companyInfo-css"
            />
          )}

          <TabBar />
          {companyData.questions.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              handlePagination={handlePagination}
              className="pagination-container"
            />
          )}
        </>
      )}
    </StyledPage>
  );
}

export default CompanyInfoPage;
