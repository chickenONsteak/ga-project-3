import Modal from "./Modal";

const LoginOverlay = ({ onClose, onLogin }) => {
  return (
    <Modal onClose={onClose}>
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <button onClick={onLogin}>Login</button>
    </Modal>
  );
};
