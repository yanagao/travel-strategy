import { useState } from 'react';
import { DatePicker, Input } from 'antd';
import { Moment } from 'moment';
import './index.less';

const { RangePicker } = DatePicker;

interface SearchFormProps {
  handleSubmit: (
    dateRange: [Moment | null, Moment | null],
    destination: any,
    origin: any,
    backtracking: any
  ) => void;
}

const SearchForm = ({ handleSubmit }: SearchFormProps) => {
  const [destination, setDestination] = useState('');
  const [origin, setOrigin] = useState('');
  const [backtracking, setBacktracking] = useState('');
  const [dateRange, setDateRange] = useState<[Moment | null, Moment | null]>([null, null]);

  const handleDateChange = (dates: [Moment | null, Moment | null]) => {
    setDateRange(dates);
  };

  const onSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    handleSubmit(dateRange, destination, origin, backtracking);
  };

  return (
    <div className="form-container">
      <form className='form'>
        <div className='input-group'>
          <label htmlFor="destination" className='label'>目的地:</label>
          <Input
            id="destination"
            type="text"
            placeholder="请输入目的地"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className='input'
          />
        </div>

        <div className='input-group'>
          <label htmlFor="start-date" className='label'>计划日期:</label>
          <RangePicker onChange={handleDateChange} className='datePicker' />
        </div>

        <div className='input-group'>
          <label htmlFor="origin" className='label'>出发地:</label>
          <Input
            id="origin"
            type="text"
            placeholder="请输入出发地"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className='input'
          />
        </div>

        <div className='input-group'>
          <label htmlFor="backtracking" className='label'>返程地:</label>
          <Input
            id="backtracking"
            type="text"
            placeholder="请输入返程地"
            value={backtracking}
            onChange={(e) => setBacktracking(e.target.value)}
            className='input'
          />
        </div>

        <button className='button' onClick={onSubmit}>搜索</button>
      </form>
    </div>
  );
};

export default SearchForm;
