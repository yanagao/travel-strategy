import { useEffect } from 'react';
// import { fetchData } from '@/apis/openai';
import SearchForm from '@/components/SerchForm';
import './index.less';

function Index() {

  useEffect(() => {
    // fetchData();
  }, []);
  return (
    <div className="index-page">
      <SearchForm />
    </div>
  );
}

export default Index;
