import { useState, useMemo } from 'react';
import { IoMdSettings } from 'react-icons/io';

import { Modal } from '../modal';
import { Field } from './field';

import { useTimers } from '@/stores/timers';

import styles from './form.module.css';
import { useSettings } from '@/stores/settings';

export function Form() {
  const [showSettings, setShowSettings] = useState(false);

  const volume = useSettings(state => state.volume);
  const setVolume = useSettings(state => state.setVolume);

  const [name, setName] = useState('');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(10);
  const [seconds, setSeconds] = useState(0);
  const [autoStart, setAutoStart] = useState(false);

  const totalSeconds = useMemo(
    () => hours * 60 * 60 + minutes * 60 + seconds,
    [hours, minutes, seconds],
  );

  const add = useTimers(state => state.add);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (totalSeconds === 0) return;

    add({
      autoStart,
      name,
      total: totalSeconds,
    });

    setName('');
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Field
          label="计时器名称"
          optional
          type="text"
          value={name}
          onChange={value => setName(value as string)}
        />

        <div className={styles.timeFields}>
          <Field
            label="小时"
            type="select"
            value={hours}
            onChange={value => setHours(value as number)}
          >
            {Array(13)
              .fill(null)
              .map((_, index) => (
                <option key={`hour-${index}`} value={index}>
                  {index}
                </option>
              ))}
          </Field>

          <Field
            label="分钟"
            type="select"
            value={minutes}
            onChange={value => setMinutes(value as number)}
          >
            {Array(60)
              .fill(null)
              .map((_, index) => (
                <option key={`minutes-${index}`} value={index}>
                  {index}
                </option>
              ))}
          </Field>

          <Field
            label="秒"
            type="select"
            value={seconds}
            onChange={value => setSeconds(value as number)}
          >
            {Array(60)
              .fill(null)
              .map((_, index) => (
                <option key={`seconds-${index}`} value={index}>
                  {index}
                </option>
              ))}
          </Field>
        </div>

        <div className={styles.autoStart}>
          <label>
            <input
              checked={autoStart}
              type="checkbox"
              onChange={() => setAutoStart(prev => !prev)}
            />
            自动启动计时器
          </label>
        </div>

        <div className={styles.buttons}>
          <button className={styles.primary} type="submit">
            Add Timer
          </button>
          <button type="button" onClick={() => setShowSettings(true)}>
            <IoMdSettings />
          </button>
        </div>
      </form>

      <Modal show={showSettings} onClose={() => setShowSettings(false)}>
        <div className={styles.settings}>
          <h2>设置</h2>

          <div className={styles.field}>
            <label htmlFor="volume">音量</label>
            <input
              max={1}
              min={0}
              step={0.1}
              type="range"
              value={volume}
              onChange={e => setVolume(+e.target.value)}
            />
          </div>

          <div className={styles.notice}>
            <strong>注意:</strong> 对这些设置的更改将影响所有计时器，并会自动保存。
          </div>
        </div>
      </Modal>
    </>
  );
}
