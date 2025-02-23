DECLARE
   v_unique_constraint EXCEPTION;
   PRAGMA EXCEPTION_INIT(v_unique_constraint, -1); 
BEGIN
   INSERT INTO SYUSR
     (USRID,
      USRNAME,
      EMAIL,
      PW,
      ACTIVE_YN,
      LOCK_YN,
      ADMIN_YN,
      STUDENT_YN)
   VALUES
     (:USRID,
      :USRNAME,
      :EMAIL,
      :PW,
      :ACTIVE_YN,
      :LOCK_YN,
      :ADMIN_YN,
      :STUDENT_YN);
   COMMIT;

    -- Successful insert response
    owa_util.status_line(200, 'OK');
    owa_util.mime_header('application/json', TRUE); 
    htp.p('{
        "status": "Success", 
        "message": "User successfully registered 👍"
    }');
    owa_util.http_header_close;

EXCEPTION
    -- Unique constraint violation response
    WHEN v_unique_constraint THEN
        owa_util.status_line(409, 'Conflict');
        owa_util.mime_header('application/json', TRUE);
        htp.p('{
            "status": "unique value", 
            "message": "Error: USRID or EMAIL already exists! 👎"
        }');
        owa_util.http_header_close;
    ROLLBACK;
    
    -- Handle other exceptions
    WHEN OTHERS THEN
        owa_util.status_line(500, 'Internal Server Error');
        owa_util.mime_header('application/json', TRUE); 
        htp.p('{
            "status": "Error", 
            "message": "An unexpected error occurred. 💥"
        }');
        owa_util.http_header_close;
    ROLLBACK;
END;

