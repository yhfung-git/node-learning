import { createPortal } from 'react-dom';
import './styles/Backdrop.css';

const Backdrop = (props) =>
  createPortal(
    <div
      className={`backdrop ${props.open ? 'open' : ''}`}
      onClick={props.onClick}
    />,
    document.getElementById('backdrop-root')
  );

export default Backdrop;