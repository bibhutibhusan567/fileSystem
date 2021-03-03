import { Table,Button } from "reactstrap";

export default function FileList(props) {
  return (
    <Table>
      <thead>
        <tr>
          <th>#</th>
          <th>File Name</th>
          <th>Date</th>
          <th>Time</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {props.list.map((file, idx) => {
          return (
            <tr key={idx}>
              <th>{idx + 1}</th>
              <td>{file.fileName}</td>
              <td>{file.date}</td>
              <td>{file.time}</td>
              <td><Button onClick={()=>props.downloadHandler(file.fileName)}>Download</Button></td>
              <td><Button onClick={()=>props.deleteHandler(file.id)}>Delete</Button></td>

            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
