const TestUserRow = (props) => {
  return (
    <>
      <td>{props.user.firstName}</td>
      <td>{props.user.lastName}</td>
    </>
  );
};

export default TestUserRow;
