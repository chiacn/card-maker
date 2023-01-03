import React from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useInterval } from '../../common/common';
import styles from './timer.module.css';

export default function Timer({unifiedTemplate=false, frameId}) {
    const [hour, setHour] = useState();
    const [minute, setMinute] = useState();
    const [second, setSecond] = useState();
    const [isRunning, setIsRunning] = useState(false);

    // Checkbox 관련 
    const [checkLink, setCheckLink] = useState(false);
    const [checkText, setCheckText] = useState(false);

    const start = (e) => {
        if(e.target.innerHTML === 'START') {
            console.log('start = ', hour + minute + second)
            if(calculateTime() > 0) {
                setIsRunning(true);
            }
        }else {
            setIsRunning(false);
        }
    }

    useInterval(
        run,
        isRunning ? 1000 : null
    )     

    const stop = () => {
        setIsRunning(false);
    }

    const reset = () => {
        setHour(0);
        setMinute(0);
        setSecond(0);
        setIsRunning(false);
    }

    function run() {
        console.log('run 작동---- ')
        const totalTime = calculateTime(1);

        // 정수로 바꿔주기 위해 parseInt
        const hour = parseInt(totalTime / 3600).toString().padStart(2,"0");
        const remaining_hour = parseInt(totalTime % 3600).toString().padStart(2,"0");
        const minute = parseInt(remaining_hour / 60).toString().padStart(2,"0");
        const second = parseInt(remaining_hour % 60).toString().padStart(2,"0");

        if(totalTime < 0) {
            setIsRunning(false)
            return;
        };

        setHour(hour);
        setMinute(minute);
        setSecond(second);

    }

    function calculateTime(minusNum=false) {
        const h = hour == undefined ? 0 : Number(hour);
        const m = minute == undefined ? 0 : Number(minute);
        const s = second == undefined ? 0 : Number(second);
        if(minusNum) {
            return (h*3600 + m*60 + s) - minusNum;
        }else {
            return (h + m + s);
        }
    }

    const onChange = (e) => {

        if(e.target.name === 'hour') {
            const hour = setFormat(e.target.value);
            setHour(hour);
        }
            
        if(e.target.name === 'minute') {
            const minute = setFormat(e.target.value)
            setMinute(minute);
        }
        if(e.target.name === 'second') {
            const second = setFormat(e.target.value);
            setSecond(second);
        }
    }

    function setFormat(num) {
        let formattedNum;
        formattedNum = num.toString().padStart(2, "0"); 

        if(num.length > 2) {
            formattedNum = num.substr(-2,2);
        }
        
        // 1. 59일 때 대체  -> 일의 자리만 대체
        if(formattedNum > 59) formattedNum = '59';
        if(num.substr(0,2) == '59') formattedNum = '5' + num.substr(-1,1);
         
        return formattedNum;
    }

    // checkbox 관련 로직
    const handleOptionCheck = (e) => {
        console.log('handleOptionCheck / e = ', e.target.id)
        console.log('frameId = ', frameId)
        if(e.target.id === 'cbtest-19-link' + frameId) { // Link 클릭할 때
            !checkLink && setCheckLink(true) 
            if(!checkLink) {
                setCheckLink(true); 
                setCheckText(false);
            }
        }else {
            if(!checkText) {
                setCheckText(true);
                setCheckLink(false);
            }
        }
    }

    return (
        !unifiedTemplate ? (
        <div className={styles.frame}>
            <div className={styles.timer}>
                <div className={styles.timer__hourArea}>
                    <input 
                        type="number"
                        name="hour"
                        placeholder="00" 
                        value={hour || ''} 
                        onChange={onChange} 
                        maxlength="2"
                        max="30"
                        min="0"
                        pattern="\d*"
                    /> :
                </div> 

                <div className={styles.timer__minuteArea}>
                    <input 
                        type="number" 
                        name="minute"
                        placeholder="00" 
                        value={minute || ''}
                        onChange={onChange} 
                        maxlength="2" 
                        max="59"
                        min="0"
                    /> :
                </div>

                <div className={styles.timer__secondArea}>
                    <input 
                        type="number" 
                        name="second"
                        placeholder="00" 
                        value={second || ''}
                        onChange={onChange} 
                        maxlength="2"
                        max="59"
                        min="0"
                    />
                </div>
            </div>
            <div className={styles["button__timer-btn"]}>
                <button onClick={start}>
                    {isRunning && (hour + minute + second) > 0? 'STOP' : 'START'}
                </button>
                <button onClick={reset}>
                    Reset
                </button>
            </div>
        </div>

        ) :  // unifiedTemplate =====================================================================

        <div className={styles.uni_frame}>
            <div className={styles.uni_timer}>
                <div className={styles.uni_timer__hourArea}>
                    <input 
                        type="number"
                        name="hour"
                        placeholder="00" 
                        value={hour || ''} 
                        onChange={onChange} 
                        maxlength="2"
                        max="30"
                        min="0"
                        pattern="\d*"
                    /> :
                </div> 

                <div className={styles.uni_timer__minuteArea}>
                    <input 
                        type="number" 
                        name="minute"
                        placeholder="00" 
                        value={minute || ''}
                        onChange={onChange} 
                        maxlength="2" 
                        max="59"
                        min="0"
                    /> :
                </div>

                <div className={styles.uni_timer__secondArea}>
                    <input 
                        type="number" 
                        name="second"
                        placeholder="00" 
                        value={second || ''}
                        onChange={onChange} 
                        maxlength="2"
                        max="59"
                        min="0"
                    />
                </div>
            </div>
            <div className={styles["uni_timer__feature"]}>
                
                {/* unifiedTemplate 속성 추가 시 button 구성 */}
                <div className={styles.uni_timer__option}>
                    <div className={styles["checkbox-wrapper-19"]}>
                        {/* 
                            id에 frameId를 넣어서 timer 컴포넌트 별로 별개의 input label id를 만드는 이유
                            - checkbox 관련 CSS에서 input의 display를 지우고 label을 사용하고 있음.
                                => 그래서 특정 timer의 checkbox를 체크해도 다른 timer의 체크박스가 체크됐음. -> 각 고유의 id값을 줘서 해결.
                        */}
                        <input type="checkbox" id={"cbtest-19-link" + frameId} checked={checkLink} onChange={handleOptionCheck}/>
                        <label htmlFor={"cbtest-19-link" + frameId} className={styles["check-box"]}/>
                    </div>
                    
                    <p>Link</p>

                    <div className={styles["checkbox-wrapper-19"]}>
                        <input type="checkbox" id={"cbtest-19-alarm" + frameId} checked={checkText} onChange={handleOptionCheck}/>
                        <label htmlFor={"cbtest-19-alarm" + frameId} className={styles["check-box"]}/>
                    </div>
                    <p>Text</p>
                </div>

                <div className={styles["uni_timer__input"]}>
                    <input type="text" />
                </div>

                <div className={styles.uni_timer__button}>
                    <div className={styles["uni_timer__button--startStop"]}>
                        <button onClick={start}>
                            {isRunning && (hour + minute + second) > 0? 'STOP' : 'START'}
                        </button>
                    </div>
                    <div className={styles["uni_timer__button--reset"]}>
                        <button onClick={reset}>
                            Reset
                        </button>
                    </div>
                </div>
            </div>
        </div>

    );
} 

