import React, { useEffect, useState } from 'react'
// import NavBar2 from './NavBar2'
import { useParams, useNavigate } from 'react-router-dom'
import "../CSS/oneMemberDetail.css"
import * as Icon from "react-bootstrap-icons"
import { NavLink } from 'react-router-dom'
import LoadingBar from 'react-top-loading-bar'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function OneMemberData() {
    const navigate = useNavigate()
    const { id } = useParams()

    document.title = "GYMGROW"

    const [oneData, setoneData] = useState("")
    const [oneDataHistory, setoneDataHistory] = useState([])
    const [reg, setreg] = useState({
        regis: "", feedur: ""
    })
    const [progress, setProgress] = useState(0)

    const [dashboard, setdashboard] = useState(true)
    const [displayEditMember, setDisplayEditMember] = useState(false)
    const [displayhistoryUpdate, setdisplayhistoryupdate] = useState(false)

    const [run, setrun] = useState(false)
    // const [clsname, setclaname] = useState("Memberactionactive")
    const clsname = "Memberactionactive"
    let data;
    const oneMember = async (id) => {
        try {
            setProgress(30)
            const res = await fetch("/onemember/" + id, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            setProgress(60)
            data = await res.json();
            setProgress(100)
            setoneData(data)
            // console.log(oneData);
            setoneDataHistory(data.feeHistory)
            setreg({ regis: data.registerdate[data.registerdate.length - 1], feedur: data.feeDuration[data.feeDuration.length - 1] })
            // console.log(reg);
            // console.log(data);
        } catch (error) {
            console.log(error);
            navigate("/")
        }
    }
    let Remaining;

    useEffect(() => {
        oneMember(id);
        // eslint-disable-next-line
    }, [run])

    const registeration = new Date(reg.regis)
    const feeDuration = new Date(reg.feedur);
    const q = new Date();
    if (q.getTime() > registeration.getTime()) {
        // console.log("Q is greater")
        const diff = feeDuration.getTime() - q.getTime();
        const one_day = 1000 * 3600 * 24;
        Remaining = Math.ceil(diff / one_day)
        console.log(Remaining);
    }
    else {
        // console.log("Register is greater")
        const diff = feeDuration.getTime() - registeration.getTime();
        const one_day = 1000 * 3600 * 24;
        Remaining = Math.ceil(diff / one_day)
        console.log(Remaining);
    }

    // eslint-disable-next-line


    const displadashboard = () => {
        setdashboard(true)
        setDisplayEditMember(false)
        setdisplayhistoryupdate(false)
    }

    const toggleDisplay = () => {
        setdashboard(false)
        setDisplayEditMember(true)
        setdisplayhistoryupdate(false)
    }

    const displayUpdate = () => {
        setdashboard(false)
        setDisplayEditMember(false)
        setdisplayhistoryupdate(true)
    }


    const [datq, setDat] = useState({ feeDuration: "" });
    const [registerationDate, setregisterDate] = useState({ registerdate: "" })
    const [plane, setplane] = useState({ feeDuration: "" })
    const [addamount, setaddamount] = useState({ amount: "", remark: "" })
    const _id = oneData._id

    const handleDate = (e) => {
        e.preventDefault();
        const name = e.target.name
        const value = e.target.value
        setregisterDate({ ...registerationDate, [name]: value })
        setaddamount({ ...addamount, [name]: value })
        const q = new Date(registerationDate.registerdate)
        const duration = new Date(q.getFullYear(), q.getMonth() + parseInt(value), q.getDate());
        setplane({ ...plane, [name]: value });
        setDat({ ...datq, [name]: duration })
    }


    const addHistory = async (e) => {
        e.preventDefault();

        const { feeDuration } = datq;
        const planeType = plane.feeDuration
        const { registerdate } = registerationDate
        const { amount, remark } = addamount
        // console.log(idd);
        const res = await fetch("/addHistory/" + _id, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                registerdate, planeType, amount, feeDuration, remark
            })
        })
        await res.json();
        if (res.status === 422) {
            toast.error('Fill All The Fields!', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
        else if (res.status === 200) {
            setrun((e) => !e)
            toast.success('Pack Update Success', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setdashboard(true)
            setDisplayEditMember(false)
            setdisplayhistoryupdate(false)
        }
        else {
            toast.error('Something Went Wrong', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    }

    const [memberUpdate, setmemberUpdate] = useState({
        address: "", dite: ""
    })
    const mamberdetailUpdate = (e) => {
        e.preventDefault();
        var name = e.target.name;
        var value = e.target.value;

        setmemberUpdate({ ...memberUpdate, [name]: value })

    }

    const patchMemberUpdate = async (e) => {
        try {
            e.preventDefault();
            const { address, dite } = memberUpdate
            console.log("running");


            const res = await fetch("/updatemember/" + _id, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    address, dite
                })
            })
            await res.json();
            if (res.status === 422) {
                toast.error('Fill All The Fields!', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            }
            else if (res.status === 200) {
                toast.success("Member Data Update Success", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                setrun((e) => !e)
                setdashboard(true)
                setDisplayEditMember(false)
                setdisplayhistoryupdate(false)
            }
            else {
                toast.error("Something Went Wrong !", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            }

        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
            {/* <NavBar2 gymname={oneData.userName}/> */}
            <LoadingBar
                color='red'
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
            />
            <div className="onememberdetail">
                <div className="username">
                    <h3>USERNAME:-{oneData.userName}</h3>
                    <h4>{Remaining} Days Left</h4>
                </div>
                <div className="action_card">
                    <div className="action">
                        <p className={dashboard === true ? clsname : ""} onClick={displadashboard}><span><Icon.Globe className='MemberActionicon' /></span> Dashboard</p>
                        <p onClick={toggleDisplay} className={displayEditMember === true ? clsname : ""}><span><Icon.Person className='MemberActionicon' /></span> Edit Member</p>
                        {/* <p onClick={history}><span><Icon.HSquareFill className='MemberActionicon' /></span> Fee History</p> */}
                        <p className={displayhistoryUpdate === true ? clsname : ""} onClick={displayUpdate}><span><Icon.ClockFill className='MemberActionicon' /></span> Update History</p>
                        <NavLink to="/memberdetails"><span><Icon.ArrowBarLeft className='MemberActionicon' /></span> Back</NavLink>
                    </div>

                    <div className="card" style={dashboard === false ? { display: "none" } : { display: "block" }}>
                        <h2>{oneData.name}</h2>
                        <h2>{oneData.phone}, {oneData.address}</h2>
                        <div className="dite">
                            <h2>Dite:- {oneData.dite}</h2>
                        </div>
                    </div>


                    {/* -------------------Member Detail update------------------------------  */}
                    <div className='sign oneMemberDetailForm' style={displayEditMember === false ? { display: "none" } : { display: "block" }}>
                        <h2>Edit Details</h2>
                        <form method="PATCH" >
                            <label htmlFor="address">Address</label>
                            <input type="text" name="address" value={memberUpdate.address} onChange={mamberdetailUpdate} placeholder='Address' />
                            <label htmlFor="textarea" >Dite</label>
                            <textarea name="dite" cols="30" rows="4" value={memberUpdate.dite} onChange={mamberdetailUpdate} ></textarea>
                            <button onClick={patchMemberUpdate}>Update</button>
                        </form>
                    </div>

                    {/* -------------------Member Fee update------------------------------  */}

                    <div className="sign oneMemberDetailForm" style={displayhistoryUpdate === false ? { display: "none" } : { display: "block" }}>
                        <h2>Update Fee</h2>
                        <form method='POST'>
                            <div className="input-line">
                                <label htmlFor="registerdate">Register Date </label>
                                <input type="date" name='registerdate' value={registerationDate.registerdate} onChange={handleDate} />
                                <label htmlFor="feeDuration"> Plane Type</label>
                                <select name="feeDuration" defaultValue={'DEFAULT'} onChange={handleDate}>
                                    <option value="DEFAULT" disabled>Fee Type</option>
                                    <option value="1">1 Months</option>
                                    <option value="3">3 Months</option>
                                    <option value="12">1 Year</option>
                                </select>
                            </div>
                            <div className="input-line2">
                                <label htmlFor="amount">Amount</label>
                                <input type="number" name='amount' value={addamount.amount} onChange={handleDate} placeholder='Amount' />
                                <label htmlFor="remark">Remark</label>
                                <input type="text" name='remark' value={addamount.remark} onChange={handleDate} placeholder="Remark" />
                            </div>
                            <button onClick={addHistory}>Add Amount</button>
                        </form>
                    </div>
                </div>


                <table>
                    <caption>History Summary</caption>
                    <thead>
                        <tr>
                            <th scope="col">Plane Type</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Period</th>
                            <th scope="col">Remaining</th>
                            <th scope="col">Remark</th>

                        </tr>
                    </thead>
                    {
                        oneDataHistory.reverse().map((curr, index) => {
                            const registeration = new Date(curr.registerdate)
                            const x = registeration.toLocaleDateString();

                            const feeDuration = new Date(curr.feeDuration);
                            const z = feeDuration.toLocaleDateString();
                            const q = new Date();
                            if (q.getTime() > registeration.getTime()) {
                                // console.log("Q is greater")
                                const diff = feeDuration.getTime() - q.getTime();
                                const one_day = 1000 * 3600 * 24;
                                Remaining = Math.ceil(diff / one_day)
                            }
                            else {
                                // console.log("Register is greater")
                                const diff = feeDuration.getTime() - registeration.getTime();
                                const one_day = 1000 * 3600 * 24;
                                Remaining = Math.ceil(diff / one_day)
                            }
                            return (
                                <tbody>
                                    <>
                                        <tr>
                                            <td data-label="Plane Type">{curr.planeType} Month</td>
                                            <td data-label="Amount">{curr.amount}</td>
                                            <td data-label="Period">{x} - {z}</td>
                                            <td data-label="Remaining Days">{Remaining}</td>
                                            <td data-label="Remark">{curr.remark === "" ? "First Payment" : curr.remark}</td>
                                        </tr>
                                    </>
                                </tbody>
                            )
                        })
                    }
                </table>
            </div>

            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover={false}
                theme="dark"

            />

        </>
    )
}
