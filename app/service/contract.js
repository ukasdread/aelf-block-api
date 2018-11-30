/*
 * huangzongzhe
 * 2018.08
 */
const Service = require('egg').Service;

class ContractService extends Service {
    
    async getDetail(options) {
        const aelf0 = this.ctx.app.mysql.get('aelf0');
        const { contract_address } = options;
        
        let detailSql = `select * from contract_aelf20 where contract_address=?`;

        let detail = await aelf0.query(detailSql, [ contract_address ]);
        // let result = await aelf0.query('select * from blocks_0 ORDER BY block_height ASC limit 10 offset 0');
        return detail;
    }

    async getContracts(options) {
        const aelf0 = this.ctx.app.mysql.get('aelf0');
        const { limit, page, order, chain_id } = options;
        if (['DESC', 'ASC', 'desc', 'asc'].indexOf(order) > -1) {
            const offset = limit * page;
            
            let contractMatchSql = '';
            let sqlValue = [limit, offset];
            if (chain_id) {
                contractMatchSql = ' where chain_id=? ';
                sqlValue = [chain_id, limit, offset];
            }

            let getTxsSql = `select SQL_CALC_FOUND_ROWS * from contract_aelf20  
                             ${contractMatchSql} 
                            ORDER BY name ${order} limit ? offset ? `;
            let getCountSql = `SELECT FOUND_ROWS()`;

            let txs = await aelf0.query(getTxsSql, sqlValue);
            let count = await aelf0.query(getCountSql);

            return {
                total: count[0]["FOUND_ROWS()"],
                transactions: txs
            };
        }
        return '傻逼，滚。';
    }
}

module.exports = ContractService;