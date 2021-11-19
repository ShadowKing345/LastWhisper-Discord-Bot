import {createDayEmbed} from "../../src/modules/buffManager";
import {Day} from "../../src/objects/BuffManager";
// @ts-ignore
import dayjs, {Dayjs} from "dayjs";
import {MessageEmbed} from "discord.js";

it("Create Day Embed", () => {
    const day: Day = new Day();
    const unix: Dayjs = dayjs.unix(0);
    const embed: MessageEmbed = new MessageEmbed().setColor("GREEN").setTitle("Test Title").setDescription(day.text).setThumbnail(day.imageUrl).setFooter(unix.format("dddd Do MMMM YYYY"));

    expect(createDayEmbed("Test Title", day, unix, "GREEN")).toEqual(embed)
});
