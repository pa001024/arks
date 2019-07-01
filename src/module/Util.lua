local p = {}

-- iterator sorted by keys
function p.skpairs(t)
  local keys = {}
  for k in pairs(t) do
    keys[#keys + 1] = k
  end
  table.sort(keys)

  local i = 0
  local iterator = function()
    i = i + 1
    local key = keys[i]
    if key then
      return key, t[key]
    else
      return nil
    end
  end
  return iterator
end

-- conveniently shifts BLAH to Blah
-- Handy when formatting data in ALL CAPS or all lower case
function p.titleCase(head, tail)
  if tail == nil then
    --Split into two lines because dont want the other return from gsub
    local result = string.gsub(head, "(%a)([%w_']*)", p.titleCase)
    return result
  else
    return string.upper(head) .. string.lower(tail)
  end
end

--Returns the number of rows in a table
--Originally snagged this from Module:VoidByReward written by User:NoBrainz
function p.tableCount(t)
  local count = 0
  for _ in pairs(t) do
    count = count + 1
  end
  return count
end

--Sorts theTable based on the listed column
function p.tableSort(theTable, sortCol, ascend)
  local new
  function sorter(r1, r2)
    if (ascend) then
      return r1[sortCol] < r2[sortCol]
    else
      return r1[sortCol] > r2[sortCol]
    end
  end
  table.sort(theTable, sorter)
end

--Splits a string based on a sent in separating character
--For example calling splitString ("Lith V1 Relic", " ") would return {"Lith", "V1", "Relic"}
function p.splitString(inputstr, sep)
  if sep == nil then
    sep = '%s'
  end
  local t = {}
  for str in string.gmatch(inputstr, '([^' .. sep .. ']+)') do
    table.insert(t, str)
  end
  return t
end

--Returns 'true' if a string starts with something
--For example calling startsWith ("Lith V1 Relic", "Lith") would return true
function p.startsWith(string1, start)
  return string.sub(string1, 1, string.len(start)) == start
end

--Stolen from Stack Overflow
--Adds commas
function p.formatnum(number)
  local i, j, minus, int, fraction = tostring(number):find('([-]?)(%d+)([.]?%d*)')

  -- reverse the int-string and append a comma to all blocks of 3 digits
  int = int:reverse():gsub('(%d%d%d)', '%1,')

  -- reverse the int-string back remove an optional comma and put the
  -- optional minus and fractional part back
  return minus .. int:reverse():gsub('^,', '') .. fraction
end

function p.round(val, maxDigits, minDigits)
  if (val == nil) then
    return nil
  else
    if (type(maxDigits) == 'table') then
      minDigits = maxDigits[2]
      maxDigits = maxDigits[1]
    end

    local result = val .. ''
    local decimals = string.find(result, '%.')
    if (decimals ~= nil) then
      decimals = string.len(result) - decimals
    else
      decimals = 0
    end

    if (maxDigits ~= nil and decimals > maxDigits) then
      result = tonumber(string.format('%.' .. maxDigits .. 'f', result))
    elseif (minDigits ~= nil and decimals < minDigits) then
      result = string.format('%.' .. minDigits .. 'f', result)
    end

    return result
  end
end

function p.contains(List, Item, IgnoreCase)
  if (List == nil or Item == nil) then
    return false
  end
  if (IgnoreCase == nil) then
    IgnoreCase = false
  end

  if (type(List) == 'table') then
    for i, listI in pairs(List) do
      if (listI == Item) then
        return true
      elseif (IgnoreCase and string.upper(listI) == string.upper(Item)) then
        return true
      end
    end
  else
    local start = string.find(List, Item)
    return start ~= nil
  end
  return false
end

--Stolen from http://lua-users.org/wiki/StringTrim
--Trims whitespace. Not quite sure how it works.
function p.trim(str)
  return (str:gsub('^%s*(.-)%s*$', '%1'))
end

-- 对象深拷贝
function p.deepClone(object)
  local lookup_table = {}
  local function _copy(object)
    if type(object) ~= 'table' then
      return object
    elseif lookup_table[object] then
      return lookup_table[object]
    end
    local new_table = {}
    lookup_table[object] = new_table
    for index, value in pairs(object) do
      new_table[index] = _copy(value)
    end
    return new_table
  end

  return _copy(object)
end

-- 将数组形式的数据转换为逗号分隔数据
function p.join(list, sep)
  local val = p.deepClone(list)
  return table.concat(val, sep or ',')
end

-- ID生成
function p.timeID()
  return os.clock() * 1e9
end

function p.map(list, func)
  local newList = {}
  for key, value in pairs(list) do
    newList[key] = func(value)
  end
  return newList
end

function p.reduce(list, func, init)
  local re = init
  for key, value in pairs(list) do
    if re then
      re = value
    else
      re = func(re, value, key)
    end
  end
end

function p.some(list, func)
  local yes = false
  for key, value in pairs(list) do
    yes = func(value, key)
    if yes then
      break
    end
  end
  return yes
end

function p.every(list, func)
  local yes = true
  for key, value in pairs(list) do
    yes = yes and func(value, key)
  end
  return yes
end

function p.Boolean(val)
  if val == 0 then
    return false
  end
  return val and true or false
end

-- 义同 tab.map(v=>v[key])
function p.pick(tab, key)
  local list = {}
  for k, value in pairs(tab) do
    list[#list + 1] = value[key]
  end
  return list
end

-- 义同a.concat(b)
function p.concat(a, b)
  local t = p.deepClone(a)
  if not b then
    return t
  end
  for _, v in ipairs(b) do
    t[#t + 1] = v
  end
  return t
end

return p
