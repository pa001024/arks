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

-- 义同 list.map(func)
function p.map(list, func)
  local newList = {}
  for key, value in pairs(list) do
    newList[key] = func(value)
  end
  return newList
end

-- 义同 list.filter(func)
function p.filter(list, func)
  local newList = {}
  for key, value in pairs(list) do
    if func(value) then
      newList[key] = value
    end
  end
  return newList
end

-- 字典转数组
function p.toArray(list)
  local newList = {}
  for _, value in pairs(list) do
    newList[#newList + 1] = value
  end
  return newList
end

-- 义同 list.sort(func)
function p.sort(list, func)
  table.sort(list, func)
  return list
end

-- 义同 list.find(func) 返回符合条件的第一个值
function p.find(list, func)
  if not func then
    return p.find(list, p.Boolean)
  end
  for _, value in pairs(list) do
    if func(value) then
      return value
    end
  end
  return nil
end

-- 多条件排序使用的工具函数 返回一个sorter
function p.byKey(key, desc)
  return function(a, b)
    if a[key] == b[key] then
      return 0
    end
    local na = a[key]
    local nb = b[key]
    if desc then
      return na > nb
    else
      return nb > na
    end
  end
end

-- 义同 list.sort((a,b)=>func(a)>func(b)) 函数需要以通过调用table.sort来实现字符串排序等功能
-- 支持string或者number类型 string使用a.localeCompare(b) number使用a-b
-- 使用desc使用倒序
--[[
  例:
  local arr = {{name="C",val=5},{name="B",val=6},{name="A",val=5}}
  -- 意为 按name升序 如相同则按val降序
  util.sortBy(arr, util.byKey("val", "desc"), util.byKey("name"))
  返回:
  {{name="B",val=6},{name="A",val=5},{name="C",val=5}}
]]
function p.sortBy(list, ...)
  local sorters = {...}
  return p.sort(
    list,
    function(a, b)
      for _, sorter in ipairs(sorters) do
        local result = sorter(a, b)
        if result ~= 0 then
          return result
        end
      end
      return false
    end
  )
end

-- 义同 list.reduce(func, init)
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

-- 义同 list.some(func)
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

-- 义同 list.every(func)
function p.every(list, func)
  local yes = true
  for key, value in pairs(list) do
    yes = yes and func(value, key)
  end
  return yes
end

-- 常用于 util.filter(list, util.Boolean) 意为去除非真值
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

-- 义同 a.concat(b)
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
