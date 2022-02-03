import Image from "next/image";
import { toast } from "react-hot-toast";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { debounce } from "lodash";
import axios from "axios";

const Enter = () => {
  let user = null;
  let username = null;

  // 1. user signed out <SignInButton />
  // 2. user signed in, but missing username <UsernameForm />
  // 3. user signed in, has username <SignOutButton />
  return (
    <main>
      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </main>
  );
};

// Sign in with Google button
function SignInButton() {
  return <button className="btn">Войти</button>;
}

// Sign out button
function SignOutButton() {
  return <button>Выйти</button>;
}

function UsernameForm() {
  const [formValue, setFormValue] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { user, username } = useContext(UserContext);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      toast.error("Some error happened");
      return;
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  //

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  // Hit the database for username match after each debounced change
  // useCallback is required for debounce to work
  const checkUsername = useCallback(
    debounce(async (username: string) => {
      if (username.length >= 3) {
        await axios.get(`${process.env.API}/unique/username`, {
          data: {
            username,
          },
        });
      }
    }, 500),
    []
  );

  return (
    <>
      {!username && (
        <section>
          <h3>Choose Username</h3>
          <form onSubmit={onSubmit}>
            <input
              name="username"
              placeholder="my name"
              value={formValue}
              onChange={onChange}
            />
            <UsernameMessage
              username={formValue}
              isValid={isValid}
              loading={loading}
            />
            <button type="submit" className="btn-green" disabled={!isValid}>
              Choose
            </button>

            <h3>Debug State</h3>
            <div>
              Username: {formValue}
              <br />
              Loading: {loading.toString()}
              <br />
              Username Valid: {isValid.toString()}
            </div>
          </form>
        </section>
      )}
    </>
  );
}

interface UsernameMessageInterface {
  username: string;
  isValid: boolean;
  loading: boolean;
}

const UsernameMessage: React.FC<UsernameMessageInterface> = ({
  username,
  isValid,
  loading,
}) => {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken!</p>;
  } else {
    return <p />;
  }
};

export default Enter;
