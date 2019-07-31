local p = {}

local getArgs = require('Module:Arguments').getArgs
local StageData = mw.loadData('Module:Stage/data')
local util = require('Module:Util')

function p.getStage(name)
  return StageData.Stages[name]
end

function p.getStageFlat(name)
  local raw = p.getStage(name)
  local dst = {}
  dst['代号'] = raw.name
  dst['地图'] = raw.preview
  dst['名称'] = raw.alterName
  dst['简介'] = raw.description
  dst['等级'] = raw.dangerLevel
  dst['突袭'] = raw.hardDesc
  dst['可演习'] = raw.canPractice
  dst['可代理'] = raw.canBattleReplay
  dst['理智'] = raw.apCost or 0
  dst['返还'] = raw.apFailReturn
  dst['演习卷'] = raw.practiceTicketCost or 1
  dst['经验'] = raw.expGain or (raw.apCost or 0) * 10
  dst['龙门币'] = raw.goldGain or (raw.apCost or 0) * 10
  dst['高亮'] = raw.hilightMark
  dst['头目'] = raw.bossMark
  dst['固定阵容'] = raw.isPredefined
  -- 数组
  dst['敌人'] =
    raw.enemies and
    util.join(
      util.map(
        raw.enemies,
        function(enemy)
          return enemy.name
        end
      )
    )
  dst['首次掉落'] = raw.firstDrop and util.join(raw.firstDrop)
  dst['角色掉落'] = raw.firstCharDrop and util.join(raw.firstCharDrop)
  dst['突袭掉落'] = raw.firstHardDrop and util.join(raw.firstHardDrop)
  dst['常规掉落'] = raw.commonDrop and util.join(raw.commonDrop)
  dst['特殊掉落'] = raw.specialDrop and util.join(raw.specialDrop)
  dst['额外掉落'] = raw.extraDrop and util.join(raw.extraDrop)
  return dst
end

function p.infobox(frame)
  local args = getArgs(frame)
  local name = args['name'] or args[1] or mw.title.getCurrentTitle().text
  local tab = p.getStageFlat(name)
  return mw.getCurrentFrame():expandTemplate {title = 'InfoboxStage/template', args = tab}
end

function p.tt(frame)
  local args = getArgs(frame)
  local name = args['name'] or args[1]
  local tab = p.getStageFlat(name)
  return mw.getCurrentFrame():expandTemplate {title = 'tt/Stage/template', args = tab}
end

function p.link(frame)
  local args = getArgs(frame)
  local name = args['name'] or args[1]
  local tab = p.getStageFlat(name)
  return mw.getCurrentFrame():expandTemplate {title = 'LinkStage/template', args = tab}
end

function p.Stage(frame)
  local args = getArgs(frame)
  local name = args['name'] or args[1]
  local tab = p.getStageFlat(name)
  return mw.getCurrentFrame():expandTemplate {title = 'Stage/template', args = tab}
end

return p