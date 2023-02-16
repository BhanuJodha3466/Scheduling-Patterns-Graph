import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

import { fetchData } from "../api";
import { actions } from "../redux";
// import styles from "../styles/patternsChart.module.css";

const PatternsChart = () => {
    const state = useSelector(state => state.patterns);
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            let data = await fetchData();

            // sortind data on bases of item_date
            data.sort((a, b) => (new Date(a.item_date)) - (new Date(b.item_date)));

            let processedData = [];
            processedData.push({
                item_date: data[0]['item_date'],
                schedule: [data[0]]
            })

            // processing and aggregates the data
            for (let i = 1; i < data.length; i++) {
                if (processedData[processedData.length - 1].item_date !== data[i].item_date) {
                    processedData.push({
                        item_date: data[i]['item_date'],
                        schedule: [data[i]]
                    })
                }
                else
                    processedData[processedData.length - 1].schedule.push(data[i]);
            }

            // setting redux state
            dispatch(actions.setData(data));
            dispatch(actions.setProcessedData(processedData));
        })()
    }, [dispatch]);

    const addToSchedule = (nextState, event) => {
        // setting clicked data to schedule chart
        dispatch(actions.setScheduleData(nextState.activePayload[0].payload.schedule));
    }

    console.log("Main State ->",state)

    return <LineChart
        width={1800}
        height={400}
        data={state.processedData}
        margin={{
            top: 15,
            right: 30,
            left: 20,
            bottom: 5,
        }}
        onClick={addToSchedule}
    >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="item_date" minTickGap={15} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" name="No. of schedules" dataKey="schedule.length" stroke="#8884d8" activeDot={{ r: 8 }} />
    </LineChart>
}

export default PatternsChart;