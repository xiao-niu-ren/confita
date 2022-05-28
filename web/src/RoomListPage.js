// Copyright 2022 The casbin Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React from "react";
import {Link} from "react-router-dom";
import {Button, Col, Popconfirm, Row, Table} from 'antd';
import moment from "moment";
import * as Setting from "./Setting";
import * as Conf from "./Conf";
import * as RoomBackend from "./backend/RoomBackend";
import i18next from "i18next";

class RoomListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      rooms: null,
    };
  }

  componentWillMount() {
    if (Setting.isAdminUser(this.props.account) || Setting.isEditorUser(this.props.account)) {
      this.getGlobalRooms();
    } else {
      this.getRooms();
    }
  }

  getRooms() {
    RoomBackend.getRooms(this.props.account.name)
      .then((res) => {
        this.setState({
          rooms: res,
        });
      });
  }

  getGlobalRooms() {
    RoomBackend.getGlobalRooms()
      .then((res) => {
        this.setState({
          rooms: res,
        });
      });
  }

  newRoom() {
    return {
      owner: this.props.account.name,
      name: `room_${this.state.rooms.length}`,
      createdTime: moment().format(),
      displayName: `New Room - ${this.state.rooms.length}`,
      conference: Conf.DefaultConferenceName,
      meetingNumber: "123456789",
      passcode: "123456",
      inviteLink: "https://zoom.us/j/123456789?pwd=123456",
      participants: [],
      status: "Ended",
    }
  }

  addRoom() {
    const newRoom = this.newRoom();
    RoomBackend.addRoom(newRoom)
      .then((res) => {
          Setting.showMessage("success", `Room added successfully`);
          this.setState({
            rooms: Setting.prependRow(this.state.rooms, newRoom),
          });
        }
      )
      .catch(error => {
        Setting.showMessage("error", `Room failed to add: ${error}`);
      });
  }

  deleteRoom(i) {
    RoomBackend.deleteRoom(this.state.rooms[i])
      .then((res) => {
          Setting.showMessage("success", `Room deleted successfully`);
          this.setState({
            rooms: Setting.deleteRow(this.state.rooms, i),
          });
        }
      )
      .catch(error => {
        Setting.showMessage("error", `Room failed to delete: ${error}`);
      });
  }

  renderTable(rooms) {
    const columns = [
      // {
      //   title: i18next.t("general:Owner"),
      //   dataIndex: 'owner',
      //   key: 'owner',
      //   width: '70px',
      //   sorter: (a, b) => a.owner.localeCompare(b.owner),
      //   render: (text, record, index) => {
      //     return (
      //       <a target="_blank" rel="noreferrer" href={Setting.getUserProfileUrl(text)}>
      //         {text}
      //       </a>
      //     )
      //   }
      // },
      {
        title: i18next.t("general:Name"),
        dataIndex: 'name',
        key: 'name',
        width: '110px',
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (text, record, index) => {
          return (
            <Link to={`/rooms/${record.owner}/${text}`}>
              {text}
            </Link>
          )
        }
      },
      {
        title: i18next.t("general:Display name"),
        dataIndex: 'displayName',
        key: 'displayName',
        width: '450px',
        sorter: (a, b) => a.displayName.localeCompare(b.displayName),
      },
      {
        title: i18next.t("submission:Conference"),
        dataIndex: 'conference',
        key: 'conference',
        width: '110px',
        sorter: (a, b) => a.conference.localeCompare(b.conference),
        render: (text, record, index) => {
          if (Setting.isAdminUser(this.props.account)) {
            return (
              <Link to={`/conferences/${text}`}>
                {text}
              </Link>
            )
          } else {
            return text;
          }
        }
      },
      // {
      //   title: i18next.t("general:Created time"),
      //   dataIndex: 'createdTime',
      //   key: 'createdTime',
      //   width: '110px',
      //   sorter: (a, b) => a.createdTime.localeCompare(b.createdTime),
      //   render: (text, record, index) => {
      //     return Setting.getFormattedDate(text);
      //   }
      // },
      {
        title: i18next.t("room:Meeting number"),
        dataIndex: 'meetingNumber',
        key: 'meetingNumber',
        width: '170px',
        sorter: (a, b) => a.meetingNumber.localeCompare(b.meetingNumber),
      },
      {
        title: i18next.t("room:Passcode"),
        dataIndex: 'passcode',
        key: 'passcode',
        width: '120px',
        sorter: (a, b) => a.passcode.localeCompare(b.passcode),
      },
      {
        title: i18next.t("room:Invite link"),
        dataIndex: 'inviteLink',
        key: 'inviteLink',
        // width: '100px',
        sorter: (a, b) => a.inviteLink.localeCompare(b.inviteLink),
        render: (text, record, index) => {
          return (
            <a target="_blank" rel="noreferrer" href={text}>
              {text}
            </a>
          )
        }
      },
      // {
      //   title: i18next.t("room:Online count"),
      //   dataIndex: 'onlineCount',
      //   key: 'onlineCount',
      //   width: '110px',
      //   sorter: (a, b) => a.onlineCount.localeCompare(b.onlineCount),
      //   render: (text, record, index) => {
      //     return record.participants.length;
      //   }
      // },
      {
        title: i18next.t("general:Status"),
        dataIndex: 'status',
        key: 'status',
        width: '110px',
        sorter: (a, b) => a.status.localeCompare(b.status),
        render: (text, record, index) => {
          if (text === "Started") {
            return i18next.t("room:Started");
          } else {
            return i18next.t("room:Ended");
          }
        }
      },
      {
        title: i18next.t("general:Action"),
        dataIndex: 'action',
        key: 'action',
        width: '160px',
        render: (text, record, index) => {
          return (
            <div>
              <Button style={{marginTop: '10px', marginBottom: '10px', marginRight: '10px'}} type="primary" onClick={() => this.props.history.push(`/rooms/${record.owner}/${record.name}`)}>{i18next.t("general:Edit")}</Button>
              <Popconfirm
                title={`Sure to delete room: ${record.name} ?`}
                onConfirm={() => this.deleteRoom(index)}
                okText="OK"
                cancelText="Cancel"
              >
                <Button style={{marginBottom: '10px'}} type="danger">{i18next.t("general:Delete")}</Button>
              </Popconfirm>
            </div>
          )
        }
      },
    ];

    return (
      <div>
        <Table columns={columns} dataSource={rooms} rowKey="name" size="middle" bordered pagination={{pageSize: 100}}
               title={() => (
                 <div>
                   {i18next.t("general:Rooms")}&nbsp;&nbsp;&nbsp;&nbsp;
                   <Button type="primary" size="small" onClick={this.addRoom.bind(this)}>{i18next.t("general:Add")}</Button>
                 </div>
               )}
               loading={rooms === null}
        />
      </div>
    );
  }

  render() {
    return (
      <div>
        <Row style={{width: "100%"}}>
          <Col span={1}>
          </Col>
          <Col span={22}>
            {
              this.renderTable(this.state.rooms)
            }
          </Col>
          <Col span={1}>
          </Col>
        </Row>
      </div>
    );
  }
}

export default RoomListPage;
