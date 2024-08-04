DECLARE
   v_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_count
    FROM SYUSR
    WHERE USRID = :usrid
    AND PW = :pw;

    -- If user is found, return success message
    IF v_count > 0 THEN
        owa_util.status_line(200, 'OK');
        owa_util.mime_header('application/json', TRUE);
        htp.p('{
            "status": "Success", 
            "message": "Login Successful! 🚀"
        }');
        owa_util.http_header_close;
    ELSE
    -- If user is not found, return error message
        owa_util.status_line(401, 'Unauthorized');
        owa_util.mime_header('application/json', TRUE);
        htp.p('{
            "status": "Error", 
            "message": "Invalid User ID or Password! 👎"
        }');
        owa_util.http_header_close;
    END IF;

    EXCEPTION
    WHEN OTHERS THEN
      -- Handle other exceptions
      owa_util.status_line(500, 'Internal Server Error');
      owa_util.mime_header('application/json', TRUE);
      htp.p('{
            "status": "Error", 
            "message": "An unexpected error occurred. 💥"
        }');
      owa_util.http_header_close;
END;