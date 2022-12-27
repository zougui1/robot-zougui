export const aliasProperties = (object: Record<string, string>, aliasMap: Record<string, { alias: string }>): Record<string, string> => {
  return Object.entries(object).reduce((payload, [key, value]) => {
    const { alias } = aliasMap[key] || {};

    if (alias) {
      payload[alias] = value;
    }

    return payload;
  }, {} as Record<string, string>);
}

export const resolveAliasedProperties = (object: Record<string, any>, aliasMap: Record<string, { option: string }>): Record<string, string> => {
  return Object.entries(object).reduce((options, [aliasName, value]) => {
    const { option } = aliasMap[aliasName] || {};

    if (option) {
      options[option] = String(value);
    }

    return options;
  }, {} as Record<string, string>);
}
