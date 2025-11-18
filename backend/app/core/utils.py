"""
Utility functions
"""
from typing import Any, Dict


def create_response(data: Any, message: str = "Success", status_code: int = 200) -> Dict[str, Any]:
    """
    Create a standardized API response
    """
    return {
        "status_code": status_code,
        "message": message,
        "data": data
    }


def format_error(message: str, details: Any = None) -> Dict[str, Any]:
    """
    Format error response
    """
    error = {"message": message}
    if details:
        error["details"] = details
    return error
