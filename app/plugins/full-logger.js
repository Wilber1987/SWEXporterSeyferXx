const { app } = require('electron');
const fs = require('fs');
const path = require('path');
const eol = require('os').EOL;

module.exports = {  
  defaultConfig: {
    enabled: false,
    deleteFileOnQuit: false,
  },
  defaultConfigDetails: {
    deleteFileOnQuit: { label: 'Delete log file before quitting app' },
  },
  pluginName: 'FullLogger',
  pluginDescription: 'Dumps data for every API event into a file.',
  init(proxy, config) {
    proxy.on('apiCommand', (req, resp) => {
      if (config.Config.Plugins[this.pluginName].enabled) {
        this.logCommand(req, resp);
      }
    });
    app.on('will-quit', () => {
      if (config.Config.Plugins[this.pluginName].deleteFileOnQuit) {
        fs.unlinkSync(path.join(config.Config.App.filesPath, 'full_log.txt'));
      }
    });
  },
  saveInBD(Obj, connection) {
   
    var query = connection.query('INSERT INTO monpickdata(pick_slot_id, unit_master_id, banned,leader,win,user,rank,id_battle,date,temp)' +
      'VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        Obj.pick_slot_id,
        Obj.unit_master_id,
        Obj.banned,
        Obj.leader,
        Obj.win,
        Obj.user,
        Obj.rank,
        Obj.id_battle,
        Obj.date,
        Obj.temp
      ], function (error, result) {
        if (error) {
          throw error;
        } else {
          console.log(result);
        }
      }
    );
   
  },
  logCommand(req, resp) {
    SelectedSeason ="Season19";
    const { command } = req;
    const MonPickData = [];
    let logfile = fs.createWriteStream(path.join(config.Config.App.filesPath, 'full_log.txt'), {
      flags: 'a',
      autoClose: true,
    });

    let logfileRTA = fs.createWriteStream(path.join(config.Config.App.filesPath, 'full_log_RTADATA.txt'), {
      flags: 'a',
      autoClose: true,
    });

    logfile.write(
      `API Command: ${command}`.concat(
        ' - ',
        Date(),
        eol,
        'Request: ',
        eol,
        JSON.stringify(req),
        eol,
        'Response: ',
        eol,
        JSON.stringify(resp),
        eol,
        eol
      )
    );
    //GetFavoriteRtpvpReplayList
    if (command == "getRankerRtpvpReplayList" || command == "getCommunityRtpvpReplayList" || command == "GetFavoriteRtpvpReplayList") {
      var mysql = require('mysql');
      var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'sw_proyect',      
        port: 3306
      });
      connection.connect(function (error) {
        if (error) {
          throw error;
        } else {
          console.log('Conexion correcta.');
        }
      });
      var dat = resp;
      if (!dat.ranker_replay_list) {
        return;
      } else {
        var ranker_replay_list = [];
        if (dat.ranker_replay_list) {
          ranker_replay_list = dat.ranker_replay_list;
        }
        ranker_replay_list.forEach((RepList) => {
          //PRIMER
          const BattleId = RepList.opp_wizard_name + "_" + RepList.wizard_name + "_" + RepList.date_add + dat.tvaluelocal;
          RepList.pick_info.unit_list.forEach(pick => {
            //banned
            if (pick.unit_master_id == 24511) {
              pick.unit_master_id = 24011;
            }
            if (pick.unit_master_id == 24512) {
              pick.unit_master_id = 24012;
            }
            if (pick.unit_master_id == 24513) {
              pick.unit_master_id = 24013;
            }
            if (pick.unit_master_id == 24514) {
              pick.unit_master_id = 24014;
            }
            if (pick.unit_master_id == 24515) {
              pick.unit_master_id = 24015;
            }
            //slayers
            if (pick.unit_master_id == 24711) {
              pick.unit_master_id = 24211;
            }
            if (pick.unit_master_id == 24712) {
              pick.unit_master_id = 24212;
            }
            if (pick.unit_master_id == 24713) {
              pick.unit_master_id = 24213;
            }
            if (pick.unit_master_id == 24714) {
              pick.unit_master_id = 24214;
            }
            if (pick.unit_master_id == 24715) {
              pick.unit_master_id = 24215;
            }
            if (RepList.pick_info.banned_slot_ids[0] == pick.pick_slot_id) {
              pick.banned = true;
            } else {
              pick.banned = false;
            }
            //leader
            if (RepList.pick_info.leader_slot_id == pick.pick_slot_id) {
              pick.leader = true;
            } else {
              pick.leader = false;
            }
            //win
            if (RepList.slot_id == RepList.win_lose && pick.banned == false) {
              pick.win = true;
            } else {
              pick.win = false;
            }
            pick.user = RepList.wizard_name;
            pick.rank = RepList.rank;
            pick.id_battle = BattleId;
            pick.date = RepList.date_add,
            pick.temp = SelectedSeason;
            MonPickData.push(pick);
            this.saveInBD(pick, connection);
          });
          //OPONENTE
          RepList.opp_pick_info.unit_list.forEach(pick => {
            if (pick.unit_master_id == 24511) {
              pick.unit_master_id = 24011;
            }
            if (pick.unit_master_id == 24512) {
              pick.unit_master_id = 24012;
            }
            if (pick.unit_master_id == 24513) {
              pick.unit_master_id = 24013;
            }
            if (pick.unit_master_id == 24514) {
              pick.unit_master_id = 24014;
            }
            if (pick.unit_master_id == 24515) {
              pick.unit_master_id = 24015;
            }
            //slayers
            if (pick.unit_master_id == 24711) {
              pick.unit_master_id = 24211;
            }
            if (pick.unit_master_id == 24712) {
              pick.unit_master_id = 24212;
            }
            if (pick.unit_master_id == 24713) {
              pick.unit_master_id = 24213;
            }
            if (pick.unit_master_id == 24714) {
              pick.unit_master_id = 24214;
            }
            if (pick.unit_master_id == 24715) {
              pick.unit_master_id = 24215;
            }
            if (RepList.opp_pick_info.banned_slot_ids[0] == pick.pick_slot_id) {
              pick.banned = true;
            } else {
              pick.banned = false;
            }
            if (RepList.opp_pick_info.leader_slot_id == pick.pick_slot_id) {
              pick.leader = true;
            } else {
              pick.leader = false;
            }
            //win
            if (RepList.opp_slot_id == RepList.win_lose && pick.banned == false) {
              pick.win = true;
            } else {
              pick.win = false;
            }
            pick.user = RepList.opp_wizard_name;
            pick.rank = RepList.opp_rank;
            pick.id_battle = BattleId;
            pick.date = RepList.date_add,
            pick.temp = SelectedSeason;
            MonPickData.push(pick);
            this.saveInBD(pick, connection);
          });
        });
      }
      connection.end();
      logfileRTA.write(
        `,`.concat(
          JSON.stringify(resp)
        )
      );
      logfileRTA.end();
    }
    logfile.end();
  },
};
