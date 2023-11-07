import React, { useState } from 'react';
import { fetchData } from '@/apis/openai';
import { DatePicker, Input } from 'antd';
import { Moment } from 'moment';
import { marked } from 'marked';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import './index.less';

const { RangePicker } = DatePicker;

const SearchForm = () => {
  const [destination, setDestination] = useState('');
  const [origin, setOrigin] = useState('');
  const [backtracking, setBacktracking] = useState('');
  const [dateRange, setDateRange] = useState<[Moment | null, Moment | null]>([null, null]);
  const [resultText, setResultText] = useState();

  const handleDateChange = (dates: [Moment | null, Moment | null]) => {
    setDateRange(dates);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // 获取日期范围的字符串表示
    const startDate = dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : '';
    const endDate = dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : '';
    // 确保日期已选择
    if (!startDate || !endDate) {
      alert('请选择开始和结束日期！');
      return;
    }
    console.log({ destination, origin, startDate, endDate });
    const prompt = `你是我的旅游助力和向导；我的计划是在${startDate}到${endDate}从${origin}出发去${destination}旅游最后返回${backtracking}；你帮我制定一个完整的旅游攻略，包括必游景点、必吃美食、预计费用，以及每日行程规划；请用markdown表格的方式输出。`
    const res = await fetchData(prompt);
    setResultText(res.choices[0].text);
    console.log(res.choices[0].text);
  };

  const convertMarkdownToWorksheet = (resultText: string): XLSX.WorkSheet => {
    // 使用Markdown解析器转换表格
    const htmlString = marked.parse(resultText);
    const el = document.createElement('html');
    el.innerHTML = htmlString;

    // 提取HTML表格到二维数组
    const data: string[][] = [];
    const rows = el.querySelectorAll('table tr');
    rows.forEach(tr => {
      const rowData: string[] = [];
      tr.querySelectorAll('td, th').forEach(td => rowData.push(td.innerText));
      data.push(rowData);
    });

    // 使用SheetJS工具将二维数组转换为工作表
    return XLSX.utils.aoa_to_sheet(data);
  };

  const handleExport = () => {
    // 转换Markdown表格为Worksheet
    const ws: XLSX.WorkSheet = convertMarkdownToWorksheet(resultText);

    // 创建工作簿并添加工作表
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // 生成Excel文件
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });

    // 保存文件
    FileSaver.saveAs(data, `${destination}strategy.xlsx`);
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className='form'>
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

        <button type="submit" className='button'>搜索</button>
      </form>
      {resultText && <div id="resultText" className='resultContainer'>
        <div dangerouslySetInnerHTML={{ __html: marked.parse(resultText) }} />
        <button className='button' onClick={handleExport}>导出为Excel</button>
      </div>}
    </div>
  );
};

export default SearchForm;
