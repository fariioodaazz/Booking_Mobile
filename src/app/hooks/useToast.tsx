import { useEffect, useState } from "react";
import styled from "styled-components/native";

const ToastWrap = styled.View`
  position: absolute;
  top: 4%;
  left: 4%;
  right: 4%;
  z-index: 2000;
  border-radius: 10px;
  padding: 12px 14px;
  background-color: #ecfdf5;
  border: 1px solid #34d39955;
`;
const ToastText = styled.Text`
  color: #065f46;
  text-align: center;
  font-weight: 600;
`;
const ToastErrorWrap = styled(ToastWrap)`
  background-color: #fef2f2;
  border-color: #fca5a555;
`;
const ToastErrorText = styled(ToastText)`
  color: #991b1b;
`;

export function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const show = (text: string) => {
    setMsg(text);
    setErr(null);
  };
  const showError = (text: string) => {
    setErr(text);
    setMsg(null);
  };

  useEffect(() => {
    if (!msg && !err) return;
    const t = setTimeout(() => {
      setMsg(null);
      setErr(null);
    }, 2500);
    return () => clearTimeout(t);
  }, [msg, err]);

  const Toast = (
    <>
      {msg ? (
        <ToastWrap>
          <ToastText>{msg}</ToastText>
        </ToastWrap>
      ) : null}
      {err ? (
        <ToastErrorWrap>
          <ToastErrorText>{err}</ToastErrorText>
        </ToastErrorWrap>
      ) : null}
    </>
  );

  return { Toast, show, showError };
}
