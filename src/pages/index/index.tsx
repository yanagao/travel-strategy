import { useEffect, useState } from 'react';
// import { fetchData } from '@/apis/openai';
import SearchForm from '@/components/SerchForm';
import './index.less';
import { fetchData } from '@/apis/openai';
import { marked } from 'marked';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { Moment } from 'moment';

function Index() {
  const [resultText, setResultText] = useState();

  useEffect(() => {
    // fetchData();
  }, []);

  const handleSubmit = async (
    dateRange: [Moment | null, Moment | null],
    destination: any,
    origin: any,
    backtracking: any
  ) => {
    // 获取日期范围的字符串表示
    const startDate = dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : '';
    const endDate = dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : '';
    // 确保日期已选择
    if (!startDate || !endDate) {
      alert('请选择开始和结束日期！');
      return;
    }
    console.log({ destination, origin, startDate, endDate });
    const prompt = `你是我的旅游助力和向导；我的计划是在${startDate}到${endDate}从${origin}出发去${destination}旅游最后返回${backtracking}；你帮我制定一个完整的旅游攻略，包括必游景点、必吃美食、预计费用，以及每日行程规划（最好是计划到具体小时）；请用markdown表格的方式输出。`
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
    FileSaver.saveAs(data, 'strategy.xlsx');
  }

  return (
    <div className="index-page">
      <SearchForm handleSubmit={handleSubmit} />
      {resultText && <div id="resultText" className='result-container'>
        <div dangerouslySetInnerHTML={{ __html: marked.parse(resultText) }} />
        <button className='button' onClick={handleExport}>导出为Excel</button>
      </div>}
    </div>
  );
}

export default Index;
