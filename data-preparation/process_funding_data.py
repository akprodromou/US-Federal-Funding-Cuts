import pandas as pd
# the re module provides regular expression-matching operations
import re

# Data location
file_path = "funding data.txt"
# Specify target file
output_csv = "processed_funding_data.csv"

# this is an inner function of process_funding_file()
def convert_funding_value(funding_str):
    """Convert funding values with units (mil., bil., k) to integer numbers."""
    # strip() method removes all leading and trailing whitespace characters from a string, e.g. 8 mil.
    funding_str = funding_str.lower().strip()
    # r: before a string in Python denotes a raw string literal
    # ([\d,.]+)	Captures one or more (+) digits (\d), commas (,), or dots (.). This allows for numbers like 1000, 1,000, 1.5
    # \s* will allow for one or multiple whitespaces between the two captures ()
    match = re.match(r'([\d,.]+)\s*(mil|bil|k)?', funding_str)
    if not match:
        return 0
    # Once the two values have been captured, unpack them from the tuple returned by .groups() into two separate variables
    value, unit = match.groups()
    # make sure commas are removed from the number values
    value = float(value.replace(',', ''))
    if unit == 'mil':
        # The underscore (_) in 1_000_000 improves readability for large numbers. It acts as a visual separator but does not affect the actual value.
        return int(value * 1_000_000)
    elif unit == 'bil':
        return int(value * 1_000_000_000)
    elif unit == 'k':
        return int(value * 1_000)
    return int(value)

def process_funding_file(file_path, output_csv):
    # the with statement will close the file without us telling it to
    # Open text file in 'read' mode
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as file:
        # readlines() is used to read all the lines at a single go and then return them in a list, where each line is a string element
        # If an empty line is met, it is returned as an empty string
        lines = file.readlines()
    
    # data will be a list of lists, where each inner element represents one row of data
    data = []
    department = ""
    name_buffer = []
    
    for line in lines:
        # start by removing leading and trailing whitespaces
        line = line.strip()
        # when line is an empty string ("")
        if not line or line.startswith(('https', '2/14')):
            continue
        """When it encounters the string "Department of", it will create a third column called "Department" 
        where all the entries that follow will be assigned the full string of that first line, 
        e.g. "Department of Agriculture". This assignment will change when the next "Department of" is met. 
        The full string of that line, e.g. "Department of Commerce" will then be assigned to the third column 
        of the data points that follow."""
        if line.startswith("Department of"):
            # Assign that line to the 'department' value
            department = line
            # end the current iteration and move to the next one
            continue
        
        if '$' in line:
            # rsplit() method returns a list of strings after breaking the given string, starting from the right side, by the specified separator
            # do maximum 1 split
            name, funding = line.rsplit('$', 1)
            # assign the int returned by the function to the 'funding' value
            funding = convert_funding_value(funding)
        elif "None reported" in line:
            name = line.replace("None reported", "").strip()
            funding = 0
        else:
            name_buffer.append(line)
            continue
        
        if name_buffer:
            # Join the previous line with the string extracted from the current one
            # Use join() rather than list[0], just to be on the safe side
            name = ' '.join(name_buffer) + ' ' + name.strip()
            # empty the name_buffer list, to be used in the next case
            name_buffer = []
        
        data.append([name, funding, department])
    
    # data can be a list of lists
    df = pd.DataFrame(data, columns=["Name", "Funding", "Department"])
    df.to_csv(output_csv, index=False)
    return df

# run the enclosingfunction
df_funding = process_funding_file(file_path, output_csv)
# the f-string is used to embed expressions and variables directly into strings
print(f"Processed data saved to {output_csv}")
