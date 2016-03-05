exports.scrubName = (name) => {
  if (name.includes('dba.')) {
    name = name.split('dba.');
    return name[name.length -1];
  }
  if (name.includes('DBA')) {
    name = name.split('DBA')
    return name[name.length - 1];
  }
  if (name.includes('dba')) {
    name = name.split('dba');
    return name[name.length -1];
  }
  if (name.includes('LLC') || name.includes('Inc')) {
    name = name.split(',');
    return name[0];
  } else {
    return name;
  }
}
