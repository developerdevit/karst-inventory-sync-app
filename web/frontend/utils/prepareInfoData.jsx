function prepareInfoData(data) {
  try {
    const parsedData = JSON.parse(data);

    const keys = Object.keys(parsedData);

    return keys?.map((key) => (
      <p key={key}>
        <b>{key}:</b>&nbsp; {parsedData?.[key]}
      </p>
    ));
  } catch (error) {
    console.log('prepareInfoData error: ', error);
    return [];
  }
}

export { prepareInfoData };
