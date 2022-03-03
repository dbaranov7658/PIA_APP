import { Tag } from "antd";

const dataSource = [
    {
        key: '1',
        name: 'PIA #1',
        status: 'APPROVED',
        submission_date: '2022-02-01',
    },
    {
        key: '2',
        name: 'PIA #2',
        status: 'PENDING',
        submission_date: '2022-01-06',
    },
    {
        key: '3',
        name: 'PIA #3',
        status: 'REJECTED',
        submission_date: '2021-11-08',
    }
      
];

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: name => {
            return <a>{ name }</a>
        }
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: status => {
            console.log(status);
            let color = 'geekblue';
            switch (status) {
                case 'APPROVED':
                    color = 'green';
                    break;
                case 'REJECTED':
                    color = 'volcano';
                    break;
                default:
                    color = 'geekblue';
            }
            return (
                <Tag color={color} key={status}>
                  {status}
                </Tag>
              );
        }
    },
    {
        title: 'Date Submitted',
        dataIndex: 'submission_date',
        key: 'submission_date',
    },
];

export {
  dataSource,
  columns
};