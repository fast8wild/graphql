import React from 'react'
import { useState, useCallback, useEffect, useRef } from 'react'
import { fetchAuditRatioData, fetchPassTrendData, fetchProfileData, fetchXPTrendData } from '../utils/api';
import { useAuth, getJWT, parseJwt } from '../utils/auth'
import { useNavigate, Navigate } from 'react-router-dom';
import { AuditRatioPieChart } from './Charts/AuditRatioPieChart';
import { XpTrendGraph } from './charts/XpTrendGraph';
import { PassTrendGraph } from './charts/PassTrendGraph';


export function ProfilePage() {
    const { isLoggedIn, logout } = useAuth();
    const [profile, setProfile] = useState([])
    const [auditRatio, setAuditRatio] = useState(null)
    const [passTrend, setPassTrend] = useState(null)
    const [xpTrend, setXpTrend] = useState(null)
    const [filterList, setFilterList] = useState([])
    const [graphFilter, setGraphFilter] = useState(0)
    const navigate = useNavigate();
    const [dataLoaded, setDataLoaded] = useState(false);

    if (!isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    const handleLogout = () => {
        logout();
        navigate("/", { replace: true });
    }

    const LoadData = async () => {
        if (dataLoaded) return;
        try {
            const jwt = getJWT();
            if (!jwt) {
                logout();
                return;
            }
            const userId = parseJwt(jwt).userId;

            const [a, b, c, d] = await Promise.all([
                fetchProfileData(userId),
                fetchAuditRatioData(userId),
                fetchPassTrendData(userId),
                fetchXPTrendData(userId)
            ])
            setProfile(a)
            setAuditRatio(b)
            setPassTrend(c)
            setXpTrend(d)
            let f = []
            d.forEach((val) => {
                if (!f.includes(val[2])) {
                    f = f.concat([val[2]])
                }
            })
            setFilterList(f)
            setDataLoaded(true)
        } catch (err) {
            console.error('Error loading data:', err);
        }
    }

    useEffect(() => {
        if (isLoggedIn && !dataLoaded) {
            LoadData()
        }
    }, [isLoggedIn, LoadData])

    if (!dataLoaded) {
        return (
            <div>Loading...</div>
        )
    }

    return (
        <div className='profile-page'>
            <button className='logout-button' onClick={handleLogout}>Logout</button> <br />
            <div className='profile container'>
                <div className='header'>Profile</div>
                Username: {profile[0]} <br></br>
                Full Name: {profile[1]} {profile[2]} <br></br>
                Level: {profile[3]}<br></br>
                XP: {profile[4]} Bytes<br></br>
                Skills: {profile[5]}<br></br>
            </div><br />
            <div className='auditRatio container'>
                <div className='header'>Audit Ratio</div>
                <AuditRatioPieChart auditRatio={auditRatio} />
            </div><br />
            <div className='filter container'>
                <div className='header'>Module Filter</div>
                <select name="filter" id="filter" value={graphFilter} onChange={(event) => setGraphFilter(Number(event.target.value))}>
                    <option value="0">All</option>
                    {
                        filterList.map((val,i) => {
                            return (
                                <option value={val} key={i}>#{val}</option>
                            )
                        })
                    }
                </select>
            </div>
            <div className='xpTrend container'>
                <div className='header'>XP Trend</div>
                <XpTrendGraph xpTrend={xpTrend} graphFilter={graphFilter} />
            </div><br />
            <div className='passTrend container'>
                <div className='header'>Pass Trend</div>
                <PassTrendGraph passTrend={passTrend} graphFilter={graphFilter} />
            </div><br />
        </div>
    )
}