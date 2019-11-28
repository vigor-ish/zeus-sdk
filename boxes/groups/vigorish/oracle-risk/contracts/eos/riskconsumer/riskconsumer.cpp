#include "../dappservices/oracle.hpp"

#define DAPPSERVICES_ACTIONS() \
  XSIGNAL_DAPPSERVICE_ACTION \
  ORACLE_DAPPSERVICE_ACTIONS
#define DAPPSERVICE_ACTIONS_COMMANDS() \
  ORACLE_SVC_COMMANDS()

#define CONTRACT_NAME() riskconsumer

using namespace std;

TABLE cvars_t {
  vector<char>  cvar;
  uint64_t      id;
  uint64_t      primary_key() const { return id; }
};
typedef eosio::multi_index <"cvars"_n, cvars_t> cvars;

CONTRACT_START()

    [[eosio::action]] void getrisk(uint64_t id, vector<char>  uri) {
        cvars cvars_table(get_self(), get_self().value);

        getURI(uri, [&]( auto& results ) {
            eosio::check(results.size() > 0, "require at least one result");
            auto cvar = results[0].result;
            cvars_table.emplace(get_self(), [&](auto& c) {
                c.cvar = cvar;
                c.id = id;
            });
            return cvar;
        });
    }

CONTRACT_END((getrisk))
