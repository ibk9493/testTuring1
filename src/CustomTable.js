import axios from "axios";
import moment from "moment/moment";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import { getToken } from "./Utils/Common";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
function CustomTable() {
  const [tableData, settableData] = useState(null);
  const [show, setShow] = useState(false);
  const [note, setnote] = useState(null);
  const [noteText, setNoteText] = useState("");
  // User is currently on this page
  const [currentPage, setCurrentPage] = useState(1);
  // No of Records to be displayed on each page
  const [recordsPerPage] = useState(10);

  const [indexOfLastRecord, setindexOfLastRecord] = useState(null);
  const [indexOfFirstRecord, setindexOfFirstRecord] = useState(null);

  const [nPages, setnPages] = useState(1);

  const [pageNumbers, setpageNumbers] = useState([]);
  const nextPage = () => {
    if (currentPage !== nPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage !== 1) setCurrentPage(currentPage - 1);
  };
  const filter = (val) => {
    console.log("ib", val);
    let arr = [...tableData.nodes];
    if (val === 0) {
    } else if (val === 1) {
      arr = tableData?.nodes.filter((item) => {
        return item.is_archived;
      });
    } else if (val === 2) {
      arr = tableData?.nodes.filter((item) => {
        return !item.is_archived;
      });
    }
    tableData["nodes"] = [...arr];
    settableData(tableData);
  };
  useEffect(() => {}, [tableData]);
  const handleClose = () => {
    setShow(false);
    setNoteText();
    setnote("");
  };
  const handleShow = () => setShow(true);
  const getData = (offset, limit) => {
    const token = getToken();
    if (!token) {
      console.log(token);

      return;
    }
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    axios
      .get(
        `https://frontend-test-api.aircall.io/calls?offset=${offset}&limit=${limit}`,
        config
      )
      .then((response) => {
        console.log(response.data);

        setindexOfLastRecord(currentPage * recordsPerPage);
        setindexOfFirstRecord(indexOfLastRecord - recordsPerPage);

        setnPages(Math.ceil(response.data?.totalCount / recordsPerPage));
        const totalPages = Math.ceil(response.data?.totalCount / 10);
        // console.log("here", totalPages);
        setpageNumbers([...Array(totalPages + 1).keys()]);
        settableData(response.data);
      })
      .catch((error) => {});
  };
  const addNote = () => {
    const token = getToken();
    if (!token) {
      console.log(token);

      return;
    }
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const bodyParameters = {
      content: noteText,
    };
    axios
      .post(
        `https://frontend-test-api.aircall.io/calls/:${note?.id}/note`,
        bodyParameters,
        config
      )
      .then((response) => {
        console.log(response.data);
        handleClose();
      })
      .catch((error) => {});
  };

  useEffect(() => {
    let data = getData(10 * currentPage, recordsPerPage);
    settableData(data);
  }, [currentPage]);
  return (
    <>
      <h3 className="p-2 mb-5">Turing Technologies Front End Test!</h3>
      <div className="d-flex align-content-center m-2">
        <p className="mr-2 p-2">Filter By</p>
        <Form.Select
          className="text-color-blue"
          style={{ maxWidth: "15vw" }}
          aria-label="Default select"
          placeholder="Status"
          defaultValue={0}
          onChange={(e) => {
            filter(e.target.value);
          }}
        >
          <option value="0">All</option>
          <option value="1">Archived</option>
          <option value="2">Unarchive</option>
        </Form.Select>
      </div>
      <div>
        <Table style={{ border: "transparent 1px" }} responsive>
          <thead style={{ color: "black", background: "#e2e2e2ed" }}>
            <tr>
              <th>CALL TYPE</th>

              <th>DIRECTION</th>

              <th>DURATION</th>

              <th>FROM</th>

              <th>TO</th>

              <th>VIA</th>

              <th>CREATED AT</th>

              <th>STATUS</th>

              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {tableData?.nodes?.map((call, idx) => (
              <tr className="p-2 text-bold">
                {" "}
                {call.call_type === "answered" && (
                  <td className="text-color-green">Answered </td>
                )}
                {call.call_type === "missed" && (
                  <td className="text-color-red">Missed</td>
                )}
                {call.call_type === "voicemail" && (
                  <td className="text-color-blue"> Voicemail</td>
                )}
                <td>{call.direction}</td>
                <td>
                  <text>
                    {moment.utc(call.duration * 1000).format("mm:ss")}
                  </text>
                  {call.duration}
                </td>
                <td>{call.from}</td>
                <td>{call.to}</td>
                <td>{call.via}</td>
                <td>{moment.utc(call.created_at).format("L")}</td>
                <td>
                  {call.is_archived ? (
                    <div
                      className="text-center p-2"
                      style={{ background: "#edfbfa", color: "#47d3c5" }}
                    >
                      Archived
                    </div>
                  ) : (
                    <div
                      className="text-center p-2"
                      style={{ background: "#eeeeee", color: "#727272" }}
                    >
                      Unarchive
                    </div>
                  )}
                </td>
                <td>
                  <Button
                    onClick={() => {
                      handleShow();
                      setnote(call);
                    }}
                  >
                    Add Note
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {console.log(tableData)}
      </div>
      <nav aria-label="...">
        <ul class="pagination">
          <li class="page-item disabled">
            <a class="page-link" onClick={prevPage} href="#" tabindex="-1">
              Previous
            </a>
          </li>
          {pageNumbers.map((pgNumber) => {
            return (
              <li
                key={pgNumber}
                className={`page-item ${
                  currentPage === pgNumber ? "active" : ""
                }`}
              >
                <a
                  class="page-link"
                  onClick={() => setCurrentPage(pgNumber)}
                  href="#"
                >
                  {pgNumber}
                </a>
              </li>
            );
          })}

          <li class="page-item">
            <a class="page-link" onClick={nextPage} href="#">
              Next
            </a>
          </li>
        </ul>
      </nav>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <div>
            <Modal.Title>AddNotes</Modal.Title>
            <br />
            <p className="text-color-blue">Call ID {note?.id}</p>
          </div>
        </Modal.Header>{" "}
        <Modal.Body>
          <div className="row">
            <div className="col-md-2">
              <p>Call Type</p>
              <p>Duration</p>
              <p>From</p>
              <p>To</p>
              <p>Via</p>
            </div>
            <div className="col-md-4">
              {note?.call_type === "answered" && (
                <p className="text-color-green">Answered </p>
              )}
              {note?.call_type === "missed" && (
                <p className="text-color-red">Missed</p>
              )}
              {note?.call_type === "voicemail" && (
                <p className="text-color-blue"> Voicemail</p>
              )}

              <p>
                {" "}
                <text>{moment.utc(note?.duration * 1000).format("mm:ss")}</text>
              </p>
              <p>{note?.from}</p>
              <p>{note?.to}</p>
              <p>{note?.via}</p>
            </div>

            <div className="col-md-4"></div>
          </div>
          <p>Notes</p>
          <textarea
            onChange={(e) => setNoteText(e.target.value)}
            style={{ width: "100%" }}
            placeholder="Add notes"
          >
            {noteText}
          </textarea>
          <div></div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleClose();
              addNote();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CustomTable;
